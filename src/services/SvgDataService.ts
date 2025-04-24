// filepath: /home/herikle/Codes/wm-platform-new/src/services/SvgDataService.ts
import SvgData, { ISvgData } from "@/src/models/SvgData";
import SvgElement from "@/src/models/SvgElement";
import mongoose from "mongoose";
import { SvgDataElement } from "../useCases/ElementUseCase/CreateElementUseCase/CreateElmentUseCase";

interface CreateSvgDataParams {
  svgName: string; // Used as production_system_name
  elements: Map<string, SvgDataElement>;
  svgElementId: mongoose.Types.ObjectId | string;
}

export class SvgDataService {
  /**
   * Creates or updates SVG data records
   * @param params Parameters containing SVG name, elements data, and SVG element ID
   * @returns The created or updated SVG data record
   */
  async createOrUpdateSvgData({
    svgName,
    elements,
    svgElementId,
  }: CreateSvgDataParams): Promise<ISvgData> {
    // Convert string ID to ObjectId if needed
    const objectId =
      typeof svgElementId === "string"
        ? new mongoose.Types.ObjectId(svgElementId)
        : svgElementId;

    // Check if SVG element exists
    const svgElementExists = await SvgElement.exists({ _id: objectId });

    if (!svgElementExists) {
      throw new Error(`SVG element with ID ${svgElementId} does not exist`);
    }

    // Check if SVG data already exists for this element
    let svgData = await SvgData.findOne({ svg_element_id: objectId });

    if (svgData) {
      // Update existing record
      svgData.production_system_name = svgName;
      svgData.data = Object.fromEntries(elements);
      await svgData.save();
    } else {
      // Create new record
      svgData = new SvgData({
        production_system_name: svgName,
        svg_element_id: objectId,
        data: elements,
      });
      await svgData.save();
    }

    return svgData;
  }
}
