// filepath: /home/herikle/Codes/wm-platform-new/src/services/SvgDataService.ts
import SvgData, { ISvgData } from "@/src/models/SvgData";
import SvgElement from "@/src/models/SvgElement";
import mongoose from "mongoose";
import { SvgDataElement } from "../useCases/ElementUseCase/CreateElementUseCase/CreateElmentUseCase";

interface CreateSvgDataParams {
  production_system_name: string; // Used as production_system_name
  specie_id: string;
  svg_element_id: string;
  elements: Map<string, SvgDataElement>;
}

export class SvgDataService {
  /**
   * Creates or updates SVG data records
   * @param params Parameters containing SVG name, elements data, and SVG element ID
   * @returns The created or updated SVG data record
   */
  async createOrUpdateSvgData({
    production_system_name,
    specie_id,
    svg_element_id,
    elements,
  }: CreateSvgDataParams): Promise<ISvgData> {
    // Create new record
    const svgData = new SvgData({
      production_system_name,
      specie_id: specie_id,
      data: elements,
      svg_element_id,
    });
    await svgData.save();

    return svgData;
  }
}
