import { optimize } from "svgo";
import { removeUnusedIdsPlugin } from "@/src/svgo/plugins/removeUnusedIdsPlugin";
import {
  RasterizedData,
  ProcessogramService,
} from "@/src/services/ProcessogramService";
import { ProcessogramDataService } from "@/src/services/ProcessogramDataService";
import { removeBxAttributesPlugin } from "@/src/svgo/plugins/removeBxAttributesPlugin";
import {
  rasterizeSvg,
  RasterizedElement,
  SvgDataFromRasterize,
} from "./utils/rasterizeSvg";
import { generateProcessogramElementDescription } from "./utils/generateProcessogramElementDescription";
import { getElementIdentifier } from "./utils/extractInfoFromId";
import {
  GeneratedProcessogramQuestions,
  generateProcessogramElementQuestions,
} from "./utils/generateProcessogramElementQuestions";
import { fixMissingSvgIdPlugin } from "@/src/svgo/plugins/fixMissingSvgIdPlugin";
import { addViewBoxPlugin } from "@/src/svgo/plugins/addViewBoxPlugin";

interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface UploadParams {
  specie_id: string;
  _id: string;
}

interface InitializeParams {
  name: string;
  specie_id: string;
  production_module_id: string;
  is_published: boolean | undefined;
  original_size_light: number | undefined;
  original_size_dark: number | undefined;
  original_name_light: string | undefined;
  original_name_dark: string | undefined;
}

interface ElementData {
  description: string;
  duration_label: string;
  duration_in_seconds: number;
}

export interface SvgDataElement {
  id: string;
  level: string;
  name: string;
  description: string;
  duration_label: string;
  duration_in_seconds: number;
}

export interface SvgQuestionElement {
  id: string;
  level: string;
  name: string;
  questions: string[];
}

interface UploadResult {
  message: string;
  rootElementId?: string;
  elementsProcessed?: number;
}

type CreateRootElementParams = {
  elementId: string;
  svgDarkContent: string;
  darkElements: RasterizedElement[];
  darkFilename: string;
  svgLightContent: string;
  lightElements: RasterizedElement[];
  lightFilename: string;
  svgData: any;
};

/**
 * Service responsible for handling SVG upload and processing
 */
export class CreateProcessogramUseCase {
  svgElementService: ProcessogramService;
  private dataService: ProcessogramDataService;

  constructor() {
    this.svgElementService = new ProcessogramService();
    this.dataService = new ProcessogramDataService();
  }

  /**
   * Main execution function for processing and uploading an SVG file
   * @param file_light - The SVG file to process
   * @param file_dark - The dark mode SVG file to process
   * @param params - Parameters for processing the file
   * @returns Result of the upload operation
   */
  async execute(
    file_light: File | null | undefined,
    file_dark: File | null | undefined,
    params: UploadParams
  ): Promise<UploadResult> {
    if (file_light) {
      this.validateFile(file_light);
    }

    if (file_dark) {
      this.validateFile(file_dark);
    }

    const {
      svgLightContent,
      svgDarkContent,
      darkElements,
      lightElements,
      svgData,
    } = await this.preProcessSvgFileAndGetElementsData({
      file_light: file_light,
      file_dark: file_dark,
    });

    const rootElement = await this.createRootElement({
      elementId: params._id,
      darkElements,
      lightElements,
      svgDarkContent,
      darkFilename: file_dark?.originalname ?? "",
      svgLightContent,
      lightFilename: file_light?.originalname ?? "",
      svgData: svgData,
    });

    this.updateSvgElementStatusToGenerating(rootElement._id);

    const elements = darkElements.length === 0 ? lightElements : darkElements;

    await this.processAndStoreSvgData(
      elements,
      svgData,
      rootElement._id,
      params.specie_id
    );

    return {
      message: "SVG file uploaded successfully",
      rootElementId: rootElement._id,
      elementsProcessed: elements.length,
    };
  }

  /**
   * Initializes a root SVG element
   * @param params - Parameters for initializing the root element
   * @returns The ID of the initialized root element
   */
  async initializeRootElement(params: InitializeParams): Promise<string> {
    const rootElement = await this.svgElementService.initializeRootElement(
      params
    );
    return String(rootElement._id);
  }

  /**
   * Process SVG files
   * @param file_light - The light mode SVG file
   * @param file_dark - The dark mode SVG file
   * @returns String preprocesseds SVG files as string
   */
  async preProcessSvgFileAndGetElementsData(params: {
    file_light: File | null | undefined;
    file_dark: File | null | undefined;
  }): Promise<{
    svgLightContent: string;
    svgDarkContent: string;
    darkElements: RasterizedElement[];
    lightElements: RasterizedElement[];
    svgData: any;
  }> {
    const { file_light, file_dark } = params;

    const svgContentLight = file_light
      ? file_light.buffer.toString("utf-8")
      : "";

    const firstStepoptimizedSvgContentLight = file_light
      ? this.optimizeSvg(svgContentLight, file_light.originalname)
      : "";

    const svgContentDark = file_dark ? file_dark.buffer.toString("utf-8") : "";

    const firstStepoptimizedSvgContentDark = file_dark
      ? this.optimizeSvg(svgContentDark, file_dark.originalname)
      : firstStepoptimizedSvgContentLight;

    const { elements: darkElements, svgData: darkSvgData } =
      await this.extractSvgElements(firstStepoptimizedSvgContentDark);

    const { elements: lightElements, svgData: lightSvgData } =
      await this.extractSvgElements(firstStepoptimizedSvgContentLight);

    if (darkElements.length === 0 && lightElements.length === 0) {
      throw new Error(
        "SVG file uploaded successfully, but no elements were found to process"
      );
    }

    const svgData = darkSvgData || lightSvgData;

    return {
      svgLightContent: firstStepoptimizedSvgContentLight,
      svgDarkContent: firstStepoptimizedSvgContentDark,
      darkElements: darkElements,
      lightElements: lightElements,
      svgData: svgData,
    };
  }

  private async updateSvgElementStatusToGenerating(
    rootId: string
  ): Promise<void> {
    await this.svgElementService.updateProcessogramStatusToGenerating(rootId);
  }

  /**
   * Validates that the uploaded file is an SVG
   * @param file - The file to validate
   * @throws Error if the file is not a valid SVG
   */
  validateFile(file: File): void {
    if (file.mimetype !== "image/svg+xml") {
      throw new Error("File must be an SVG");
    }
  }

  /**
   * Optimizes SVG content using SVGO
   * @param svgContent - The raw SVG content
   * @param filename - Original filename of the SVG
   * @returns Optimized SVG content
   */
  optimizeSvg(svgContent: string, filename: string): string {
    console.log("Optimizing SVG content for:", filename);

    const result = optimize(svgContent, {
      path: filename,
      floatPrecision: 2,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              cleanupIds: false,
            },
          },
        },
        {
          name: "inlineStyles",
          params: {
            onlyMatchedOnce: false,
          },
        },
        removeUnusedIdsPlugin,
        removeBxAttributesPlugin,
        fixMissingSvgIdPlugin,
        addViewBoxPlugin,
      ],
    });

    console.log("SVG optimization complete for:", filename);

    return result.data;
  }

  /**
   * Extracts elements from the SVG content
   * @param svgContent - The SVG content to process
   * @returns Object containing extracted elements and SVG data
   * @throws Error if SVG data extraction fails
   */
  private async extractSvgElements(svgContent: string): Promise<{
    elements: RasterizedElement[];
    svgData: SvgDataFromRasterize | null;
  }> {
    if (!svgContent) {
      return {
        elements: [],
        svgData: null,
      };
    }

    const { elements, svgData } = await rasterizeSvg(svgContent, '[id*="--"]');

    if (!svgData) {
      throw new Error("Failed to extract SVG data");
    }

    return { elements, svgData };
  }

  /**
   * Creates a raster data URL map from extracted elements
   * @param elements - The extracted SVG elements
   * @returns Map of element IDs to rasterized data
   */
  createRasterDataMap(
    elements: RasterizedElement[]
  ): Map<string, RasterizedData> {
    const rasterDataUrls = new Map<string, RasterizedData>();

    for (const element of elements) {
      rasterDataUrls.set(element.id, {
        dataUrl: element.dataUrl,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        skipUpload: element.skipUpload,
      });
    }

    return rasterDataUrls;
  }

  /**
   * Creates the root SVG element in the database
   * @param elementId - The root element ID
   * @param elements - The extracted SVG elements
   * @param svgContent - The optimized and sorted SVG content
   * @param svgData - Data extracted from the SVG
   * @param filename - Original filename of the SVG
   * @returns The created root element
   * @throws Error if root element creation fails
   */

  private async createRootElement({
    elementId,
    svgData,
    svgDarkContent,
    darkElements,
    darkFilename,
    svgLightContent,
    lightElements,
    lightFilename,
  }: CreateRootElementParams): Promise<any> {
    const rasterDataUrlsDark = this.createRasterDataMap(darkElements);
    const rasterDataUrlsLight = this.createRasterDataMap(lightElements);

    const rootElement = await this.svgElementService.createRootElement({
      _id: elementId,
      rasterImagesDark: rasterDataUrlsDark,
      rasterImagesLight: rasterDataUrlsLight,
      svgLightString: svgLightContent,
      fileNameLight: lightFilename,
      svgDarkString: svgDarkContent,
      fileNameDark: darkFilename,
      id: svgData.svgId,
      levelName: svgData.svgLevelName,
    });

    if (!rootElement) {
      throw new Error("Failed to create root SVG element");
    }

    return rootElement;
  }

  /**
   * Processes SVG elements and generates associated data
   * @param elements - The extracted SVG elements
   * @param svgData - Data extracted from the SVG
   * @param rootElementId - The root element ID
   */
  private async processAndStoreSvgData(
    elements: RasterizedElement[],
    svgData: any,
    rootElementId: string,
    specie_id: string
  ): Promise<void> {
    const processedElements = new Set<string>();

    console.log("Generating SVG data with AI...");

    for (const element of elements) {
      const elementIdentifier = getElementIdentifier(
        element.id,
        element.hierarchy
      );

      if (processedElements.has(elementIdentifier)) {
        console.log(
          `Element with ID ${elementIdentifier} has already been processed.`
        );
        continue;
      }

      console.log(`Processing element with ID ${elementIdentifier}...`);

      const processogramElementDescription =
        await this.generateElementDescription(svgData.svgName, element);

      if (processogramElementDescription) {
        await this.dataService.createOrUpdateSvgData({
          production_system_name: svgData.svgName,
          processogram_id: rootElementId,
          specie_id: specie_id,
          key: elementIdentifier,
          value: {
            id: element.id,
            level: element.levelName,
            name: element.name,
            description: processogramElementDescription.description,
            duration_label: processogramElementDescription.duration_label,
            duration_in_seconds:
              processogramElementDescription.duration_in_seconds,
          },
        });
      }

      processedElements.add(elementIdentifier);

      // Generate questions for the element
      console.log(
        `Generating questions for element with ID ${elementIdentifier}...`
      );

      const processogramElementQuestion = await this.generateElementQuestion(
        svgData.svgName,
        element
      );

      if (processogramElementQuestion) {
        await this.dataService.createOrUpdateSvgQuestions({
          production_system_name: svgData.svgName,
          processogram_id: rootElementId,
          specie_id: specie_id,
          key: elementIdentifier,
          value: {
            id: element.id,
            level: element.levelName,
            name: element.name,
            questions: processogramElementQuestion.questions,
          },
        });
      }
    }

    console.log("SVG data generation completed.");
  }

  /**
   * Generates data for an SVG element
   * @param productionSystemName - The SVG production system name
   * @param element - The SVG element
   * @returns Generated element data or null if generation fails
   */
  private async generateElementDescription(
    productionSystemName: string,
    element: RasterizedElement
  ): Promise<ElementData | null> {
    try {
      const elementData = generateProcessogramElementDescription({
        production_system_name: productionSystemName,
        levelName: element.levelName,
        name: element.name,
        hierarchy: element.hierarchy,
      });

      return elementData;
    } catch (error) {
      console.error(
        `Failed to generate data for element with ID ${element.id}:`,
        error
      );
      return null;
    }
  }

  /**
   * Generates questions for an SVG element
   * @param productionSystemName - The SVG production system name
   * @param element - The SVG element
   * @returns Generated element data or null if generation fails
   */
  private async generateElementQuestion(
    productionSystemName: string,
    element: RasterizedElement
  ): Promise<GeneratedProcessogramQuestions | null> {
    try {
      const elementData = generateProcessogramElementQuestions({
        production_system_name: productionSystemName,
        levelName: element.levelName,
        name: element.name,
        hierarchy: element.hierarchy,
      });

      return elementData;
    } catch (error) {
      console.error(
        `Failed to generate data for element with ID ${element.id}:`,
        error
      );
      return null;
    }
  }
}
