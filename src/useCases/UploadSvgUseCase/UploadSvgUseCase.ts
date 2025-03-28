import { optimize } from "svgo";
import fs from "fs";
import { removeUnusedIdsPlugin } from "src/svgo/plugins/removeUnusedIds";
import { sortSvgChildren } from "./utils/sortSvgChildren";

interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export class UploadSvgUseCase {
  async execute(file: File) {
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

    fs.writeFileSync("optimized.svg", sortedSvgContent);
    return {
      message: "SVG file uploaded successfully",
    };
  }
}
