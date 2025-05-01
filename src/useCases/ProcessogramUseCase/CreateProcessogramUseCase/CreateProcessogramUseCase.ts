import { optimize } from "svgo";
import { removeUnusedIdsPlugin } from "@/src/svgo/plugins/removeUnusedIdsPlugin";
import {
  RasterizedData,
  ProcessogramService,
} from "@/src/services/ProcessogramService";
import { SvgDataService } from "@/src/services/ProcessogramDataService";
import { removeBxAttributesPlugin } from "@/src/svgo/plugins/removeBxAttributesPlugin";
import { rasterizeSvg, RasterizedElement } from "./utils/rasterizeSvg";
import { generateElementData } from "./utils/openaiGenerate";
import { getElementIdentifier } from "./utils/extractInfoFromId";

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
  fileSize: number;
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

interface UploadResult {
  message: string;
  rootElementId?: string;
  elementsProcessed?: number;
}

/**
 * Service responsible for handling SVG upload and processing
 */
export class CreateProcessogramUseCase {
  private svgElementService: ProcessogramService;
  private svgDataService: SvgDataService;

  constructor() {
    this.svgElementService = new ProcessogramService();
    this.svgDataService = new SvgDataService();
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
   * Main execution function for processing and uploading an SVG file
   * @param file - The SVG file to process
   * @param params - Parameters for processing the file
   * @returns Result of the upload operation
   */
  async execute(file: File, params: UploadParams): Promise<UploadResult> {
    this.validateFile(file);

    const svgContent = file.buffer.toString("utf-8");
    const optimizedSvgContent = this.optimizeSvg(svgContent, file.originalname);
    // const sortedSvgContent = await sortSvgChildren(optimizedSvgContent);

    const { elements, svgData } = await this.extractSvgElements(
      optimizedSvgContent
    );

    if (elements.length === 0) {
      return {
        message:
          "SVG file uploaded successfully, but no elements were found to process",
      };
    }

    const rootElement = await this.createRootElement(
      params._id,
      elements,
      optimizedSvgContent,
      svgData,
      file.originalname
    );

    this.updateSvgElementStatusToGenerating(rootElement._id);

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
  private validateFile(file: File): void {
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
  private optimizeSvg(svgContent: string, filename: string): string {
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
        removeUnusedIdsPlugin,
        removeBxAttributesPlugin,
      ],
    });

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
    svgData: any;
  }> {
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
  private createRasterDataMap(
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
  private async createRootElement(
    elementId: string,
    elements: RasterizedElement[],
    svgContent: string,
    svgData: any,
    filename: string
  ): Promise<any> {
    const rasterDataUrls = this.createRasterDataMap(elements);

    const rootElement = await this.svgElementService.createRootElement({
      _id: elementId,
      rasterImages: rasterDataUrls,
      svgString: svgContent,
      id: svgData.svgId,
      levelName: svgData.svgLevelName,
      fileName: filename,
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

      const elementData = await this.generateElementData(
        svgData.svgName,
        element
      );

      if (elementData) {
        this.svgDataService.createOrUpdateSvgData({
          production_system_name: svgData.svgName,
          svg_element_id: rootElementId,
          specie_id: specie_id,
          key: elementIdentifier,
          value: {
            id: element.id,
            level: element.levelName,
            name: element.name,
            description: elementData.description,
            duration_label: elementData.duration_label,
            duration_in_seconds: elementData.duration_in_seconds,
          },
        });
      }

      processedElements.add(elementIdentifier);
    }

    console.log("SVG data generation completed.");
  }

  /**
   * Generates data for an SVG element
   * @param productionSystemName - The SVG production system name
   * @param element - The SVG element
   * @returns Generated element data or null if generation fails
   */
  private async generateElementData(
    productionSystemName: string,
    element: RasterizedElement
  ): Promise<ElementData | null> {
    try {
      const elementData = generateElementData({
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
