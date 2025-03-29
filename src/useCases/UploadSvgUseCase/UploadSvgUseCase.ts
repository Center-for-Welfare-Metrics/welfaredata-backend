import { optimize } from "svgo";
import fs from "fs";
import { removeUnusedIdsPlugin } from "src/svgo/plugins/removeUnusedIds";
import { rasterizeSvg, sortSvgChildren } from "./utils/sortSvgChildren";
import path from "path";

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

    const allElements = await rasterizeSvg(sortedSvgContent, '[id*="--"]');
    if (allElements.length > 0) {
      const folderPath = path.resolve("images");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      for (const element of allElements) {
        const fileName = `${element.id}.png`;
        const filePath = path.join(folderPath, fileName);

        const base64Data = element.dataUrl.replace(
          /^data:image\/png;base64,/,
          ""
        );
        fs.writeFileSync(filePath, base64Data, "base64");

        console.log(`Image saved as ${filePath}`);
      }
    }
    fs.writeFileSync("optimized.svg", sortedSvgContent);

    return {
      message: "SVG file uploaded successfully",
    };
  }
}
