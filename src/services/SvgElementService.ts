import SvgElement from "@/src/models/SvgElement";
import { upload } from "@/src/storage/storage";
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
  _id: string;
  id: string;
  fileName: string;
  rasterImages: Map<string, RasterizedData>;
  svgString: string;
  levelName: string;
};

type CreateElement = {
  id: string;
  name: string;
  levelName: string;
  specie_id: string;
  rootId: mongoose.Types.ObjectId;
};

type InitializeRootElementParams = {
  name: string;
  specie_id: string;
};

export class SvgElementService {
  async initializeRootElement({
    name,
    specie_id,
  }: InitializeRootElementParams) {
    const rootElement = new SvgElement({
      element_type: "root",
      name,
      specie_id,
      raster_images: {},
      svg_url: "",
      status: "processing",
      root_id: null,
    });

    const savedElement = await rootElement.save();

    return savedElement;
  }

  async createRootElement({
    rasterImages,
    svgString,
    _id,
    id,
    levelName,
    fileName,
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

    const svgFileName = `${fileName}.svg`;

    const svgBuffer = Buffer.from(svgString, "utf-8");

    const svgContentType = "image/svg+xml";

    const svgUploadResult = await upload(
      svgFileName,
      svgBuffer,
      svgContentType,
      "welfare"
    );

    const svgSource = svgUploadResult.Location;

    const rasterImagesObject = Object.fromEntries(rasterUrls);

    const savedElement = await SvgElement.findByIdAndUpdate(_id, {
      svg_url: svgSource,
      raster_images: rasterImagesObject,
      status: "processing",
      identifier: id,
      levelName,
    });

    return savedElement;
  }

  async createElement({
    id,
    name,
    levelName,
    specie_id,
    rootId,
  }: CreateElement) {
    const element = new SvgElement({
      identifier: id,
      name,
      levelName,
      specie_id,
      element_type: "element",
      root_id: rootId,
      status: "ready",
    });

    const savedElement = await element.save();

    return savedElement;
  }
}
