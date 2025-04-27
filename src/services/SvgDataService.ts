// filepath: /home/herikle/Codes/wm-platform-new/src/services/SvgDataService.ts
import SvgData from "@/src/models/SvgData";
import { SvgDataElement } from "../useCases/ElementUseCase/CreateElementUseCase/CreateElementUseCase";

interface CreateSvgDataParams {
  production_system_name: string; // Used as production_system_name
  specie_id: string;
  svg_element_id: string;
  key: string;
  value: SvgDataElement;
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
    key,
    value,
  }: CreateSvgDataParams) {
    const existingDoc = await SvgData.findOne({ svg_element_id }).lean();

    if (existingDoc) {
      const updatedData = {
        ...existingDoc.data,
        [key]: value,
      };

      await SvgData.updateOne(
        { svg_element_id },
        {
          $set: {
            data: updatedData,
          },
        }
      );
    } else {
      await SvgData.create({
        production_system_name,
        specie_id,
        svg_element_id,
        data: { [key]: value },
      });
    }
  }
}
