import { optimize } from "svgo";
import { removeUnusedIdsPlugin } from "@/src/svgo/plugins/removeUnusedIdsPlugin";
import {
  RasterizedData,
  SvgElementService,
} from "@/src/services/SvgElementService";
import { SvgDataService } from "@/src/services/SvgDataService";
import { removeBxAttributesPlugin } from "@/src/svgo/plugins/removeBxAttributesPlugin";
import { sortSvgChildren } from "./utils/sortSvgChildren";
import { rasterizeSvg } from "./utils/rasterizeSvg";
import { generateElementData } from "./utils/openaiGenerate";

interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface Params {
  specie_id: string;
  _id: string;
}

export class UploadSvgUseCase {
  private svgElementService: SvgElementService;
  private svgDataService: SvgDataService;

  constructor() {
    this.svgElementService = new SvgElementService();
    this.svgDataService = new SvgDataService();
  }

  async initializeRootElement({
    name,
    specie_id,
  }: {
    name: string;
    specie_id: string;
  }) {
    const rootElement = await this.svgElementService.initializeRootElement({
      name,
      specie_id,
    });

    return String(rootElement._id);
  }

  async execute(file: File, { specie_id, _id }: Params) {
    // Validate if the file is a valid SVG
    if (file.mimetype !== "image/svg+xml") {
      throw new Error("File must be an SVG");
    }

    const svgContent = file.buffer.toString("utf-8");

    const result = optimize(svgContent, {
      path: file.originalname,
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

    const optimizedSvgContent = result.data;

    const sortedSvgContent = await sortSvgChildren(optimizedSvgContent);

    // Extract elements with IDs containing "--"
    const { elements, svgData } = await rasterizeSvg(
      sortedSvgContent,
      '[id*="--"]'
    );

    if (!svgData) {
      throw new Error("Failed to extract SVG data");
    }

    if (elements.length === 0) {
      console.log("No elements with IDs found in the SVG");
      return {
        message:
          "SVG file uploaded successfully, but no elements were found to process",
      };
    }

    // Prepare raster images map for the root element
    const rasterDataUrls = new Map<string, RasterizedData>();
    for (const element of elements) {
      rasterDataUrls.set(element.id, {
        dataUrl: element.dataUrl,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      });
    }

    // Create a root SVG element in MongoDB with the SVG URL and all raster images
    const rootElement = await this.svgElementService.createRootElement({
      _id,
      rasterImages: rasterDataUrls,
      svgString: sortedSvgContent,
      id: svgData.svgId,
      levelName: svgData.svgLevelName,
      fileName: file.originalname,
    });

    if (!rootElement) {
      throw new Error("Failed to create root SVG element");
    }

    // Create elements for each rasterized element
    for (const element of elements) {
      this.svgElementService.createElement({
        rootId: rootElement._id,
        id: element.id,
        name: element.name,
        levelName: element.levelName,
        specie_id,
      });
    }

    // Process elements array into data object where ID is the key
    const svgDataElements: {
      [key: string]: {
        id: string;
        level: string;
        name: string;
        description: string;
        duration_label: string;
        duration_in_seconds: number;
      };
    } = {};

    const removeIdIndicator = (id: string) => {
      const index = id.indexOf("--");
      return index !== -1 ? id.slice(0, index) : id;
    };

    const alreadyProcessedIds = new Set<string>();

    for (const element of elements) {
      const processedId = removeIdIndicator(element.id);

      if (alreadyProcessedIds.has(processedId)) {
        console.log(
          `Element with ID ${processedId} has already been processed.`
        );
        continue;
      }

      console.log(`Processing element with ID ${processedId}...`);
      const elementData = await generateElementData({
        production_system_name: svgData.svgName,
        levelName: element.levelName,
        name: removeIdIndicator(element.name),
      });

      if (!elementData) {
        console.log(
          `Failed to generate data for element with ID ${processedId}.`
        );
        continue;
      }

      svgDataElements[processedId] = {
        id: element.id,
        level: element.levelName,
        name: element.name,
        description: elementData.description,
        duration_label: elementData.duration_label,
        duration_in_seconds: elementData.duration_in_seconds,
      };

      alreadyProcessedIds.add(processedId);
    }

    // Create SVG data automatically from processed elements
    await this.svgDataService.createOrUpdateSvgData({
      svgName: svgData.svgName,
      elements: svgDataElements,
      svgElementId: rootElement._id,
    });

    return {
      message: "SVG file uploaded successfully",
      rootElementId: rootElement._id,
      elementsProcessed: elements.length,
    };
  }
}
