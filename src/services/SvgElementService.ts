import SvgElement, { ISvgElement } from "src/models/SvgElement";
import { upload } from "src/storage/storage";
import mongoose from "mongoose";

export interface SvgElementData {
  id: string;
  dataUrl: string;
  name?: string;
  levelName?: string;
}

type CreateRootElementParams = {
  id: string;
  rasterImages: Map<string, string>;
  svgString: string;
  name: string;
  levelName: string;
  specie: string;
};

type CreateElement = {
  id: string;
  name: string;
  levelName: string;
  specie: string;
  rootId: mongoose.Types.ObjectId;
};

export class SvgElementService {
  async createRootElement({
    rasterImages,
    svgString,
    name,
    levelName,
    specie,
  }: CreateRootElementParams) {
    const rasterUrls = new Map<string, string>();

    for (const [key, value] of rasterImages.entries()) {
      const fileName = `${key}.png`;
      const base64Data = value.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");

      const contentType = "image/png";

      const uploadResult = await upload(fileName, buffer, contentType);

      console.log(`Uploaded ${fileName} to S3:`);

      const source = uploadResult.Location;

      rasterUrls.set(key, source);
    }

    const svgFileName = `${name}.svg`;

    const svgBuffer = Buffer.from(svgString, "utf-8");

    const svgContentType = "image/svg+xml";

    const svgUploadResult = await upload(
      svgFileName,
      svgBuffer,
      svgContentType
    );

    const svgSource = svgUploadResult.Location;

    const rasterImagesObject = Object.fromEntries(rasterUrls);

    const rootElement = new SvgElement({
      element_type: "root",
      name,
      levelName,
      specie,
      identifier: "root",
      raster_images: rasterImagesObject,
      svg_url: svgSource,
      root_id: null,
    });

    const savedElement = await rootElement.save();

    return savedElement;
  }

  async createElement({ id, name, levelName, specie, rootId }: CreateElement) {
    const element = new SvgElement({
      identifier: id,
      name,
      levelName,
      specie,
      element_type: "element",
      root_id: rootId,
    });

    const savedElement = await element.save();

    return savedElement;
  }
}
