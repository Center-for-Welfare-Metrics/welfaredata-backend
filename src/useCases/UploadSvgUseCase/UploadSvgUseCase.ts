import { optimize } from "svgo";
import fs from "fs";
import { removeUnusedIdsPlugin } from "src/svgo/plugins/removeUnusedIdsPlugin";
import { sortSvgChildren } from "./utils/sortSvgChildren";
import { SvgElementService } from "src/services/SvgElementService";
import SvgElement from "src/models/SvgElement";
import path from "path";
import { rasterizeSvg } from "./utils/rasterizeSvg";

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

  constructor() {
    this.svgElementService = new SvgElementService();
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
      ],
    });

    const optimizedSvgContent = result.data;

    const sortedSvgContent = await sortSvgChildren(optimizedSvgContent);

    // Extract elements with IDs containing "--"
    const { elements, svgData } = await rasterizeSvg(
      sortedSvgContent,
      '[id*="--"]'
    );

    if (elements.length === 0) {
      console.log("No elements with IDs found in the SVG");
      return {
        message:
          "SVG file uploaded successfully, but no elements were found to process",
      };
    }

    // Prepare raster images map for the root element
    const rasterDataUrls = new Map<string, string>();
    for (const element of elements) {
      rasterDataUrls.set(element.id, element.dataUrl);
    }

    // Create a root SVG element in MongoDB with the SVG URL and all raster images
    const rootElement = await this.svgElementService.createRootElement({
      id: svgData?.svgId ?? "root",
      rasterImages: rasterDataUrls,
      svgString: sortedSvgContent,
      name: svgData?.svgName ?? "default",
      levelName: svgData?.svgLevelName ?? "default",
      specie: params.specie,
    });

    if (!rootElement) {
      throw new Error("Failed to create root SVG element");
    }

    for (const element of elements) {
      await this.svgElementService.createElement({
        rootId: rootElement._id,
        id: element.id,
        name: element.name ?? "default",
        levelName: element.levelName ?? "default",
        specie: params.specie,
      });
    }

    return {
      message: "SVG file uploaded successfully",
      rootElementId: rootElement._id,
      elementsProcessed: elements.length,
    };
  }
}
