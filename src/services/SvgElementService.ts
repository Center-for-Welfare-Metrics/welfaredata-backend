import SvgElement, { ISvgElement } from "src/models/SvgElement";
import { upload } from "src/storage/storage";
import mongoose from "mongoose";

export interface SvgElementData {
  id: string;
  dataUrl: string;
  name?: string;
  levelName?: string;
}

export type RasterizedData = {
  dataUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type RasterizedElement = {
  src: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

type CreateRootElementParams = {
  id: string;
  rasterImages: Map<string, RasterizedData>;
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
    id,
  }: CreateRootElementParams) {
    const rasterUrls = new Map<string, RasterizedElement>();

    for (const [key, value] of rasterImages.entries()) {
      const fileName = `${key}.png`;
      const base64Data = value.dataUrl.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");

      const contentType = "image/png";

      const uploadResult = await upload(
        fileName,
        buffer,
        contentType,
        "welfare"
      );

      const source = uploadResult.Location;

      rasterUrls.set(key, {
        src: source,
        width: value.width,
        height: value.height,
        x: value.x,
        y: value.y,
      });
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
      identifier: id,
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
