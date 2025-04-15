import { optimize } from "svgo";
import { removeUnusedIdsPlugin } from "@/src/svgo/plugins/removeUnusedIdsPlugin";
import { sortSvgChildren } from "./utils/sortSvgChildren";
import {
  RasterizedData,
  SvgElementService,
} from "@/src/services/SvgElementService";
import { SvgDataService } from "@/src/services/SvgDataService";
import { rasterizeSvg } from "./utils/rasterizeSvg";
import { removeBxAttributesPlugin } from "@/src/svgo/plugins/removeBxAttributesPlugin";
import { generateElementData } from "./utils/openaiGenerate";

interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface Params {
  specie: string;
}

export class UploadSvgUseCase {
  private svgElementService: SvgElementService;
  private svgDataService: SvgDataService;

  constructor() {
    this.svgElementService = new SvgElementService();
    this.svgDataService = new SvgDataService();
  }

  async execute(file: File, params: Params) {
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

    const specie = params.specie.toLowerCase();

    // Create a root SVG element in MongoDB with the SVG URL and all raster images
    const rootElement = await this.svgElementService.createRootElement({
      id: svgData.svgId,
      rasterImages: rasterDataUrls,
      svgString: sortedSvgContent,
      name: svgData.svgName,
      levelName: svgData.svgLevelName,
      specie: specie,
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
        specie: specie,
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

    for (const element of elements) {
      if (!element.id.includes("--ci")) {
        const elementData = await generateElementData({
          production_system_name: svgData.svgName,
          levelName: element.levelName,
          name: element.name,
        });
        svgDataElements[element.id] = {
          id: element.id,
          level: element.levelName,
          name: element.name,
          description: elementData.description,
          duration_label: elementData.duration_label,
          duration_in_seconds: elementData.duration_in_seconds,
        };
      } else {
        svgDataElements[element.id] = {
          id: element.id,
          level: element.levelName,
          name: element.name,
          description: "",
          duration_label: "",
          duration_in_seconds: 0,
        };
      }
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
