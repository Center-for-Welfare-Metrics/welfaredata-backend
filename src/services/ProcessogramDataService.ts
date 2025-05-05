// filepath: /home/herikle/Codes/wm-platform-new/src/services/SvgDataService.ts
import { ProcessogramDataModel } from "@/src/models/ProcessogramData";
import {
  SvgDataElement,
  SvgQuestionElement,
} from "../useCases/ProcessogramUseCase/CreateProcessogramUseCase/CreateProcessogramUseCase";
import { ProcessogramQuestionModel } from "../models/ProcessogramQuestion";

interface CreateSvgDataParams {
  production_system_name: string; // Used as production_system_name
  specie_id: string;
  svg_element_id: string;
  key: string;
  value: SvgDataElement;
}

interface CreateSvgQuestionsParams {
  production_system_name: string; // Used as production_system_name
  specie_id: string;
  svg_element_id: string;
  key: string;
  value: SvgQuestionElement;
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
    const existingDoc = await ProcessogramDataModel.findOne({
      svg_element_id,
    }).lean();

    if (existingDoc) {
      const updatedData = {
        ...existingDoc.data,
        [key]: value,
      };

      await ProcessogramDataModel.updateOne(
        { svg_element_id },
        {
          $set: {
            data: updatedData,
          },
        }
      );
    } else {
      await ProcessogramDataModel.create({
        production_system_name,
        specie_id,
        svg_element_id,
        data: { [key]: value },
      });
    }
  }

  /**
   * Creates or updates SVG data records
   * @param params Parameters containing SVG name, elements data, and SVG element ID
   * @returns The created or updated SVG data record
   */
  async createOrUpdateSvgQuestions({
    production_system_name,
    specie_id,
    svg_element_id,
    key,
    value,
  }: CreateSvgQuestionsParams) {
    const existingDoc = await ProcessogramQuestionModel.findOne({
      svg_element_id,
    }).lean();

    if (existingDoc) {
      const updatedData = {
        ...existingDoc.data,
        [key]: value,
      };

      await ProcessogramQuestionModel.updateOne(
        { svg_element_id },
        {
          $set: {
            data: updatedData,
          },
        }
      );
    } else {
      await ProcessogramQuestionModel.create({
        production_system_name,
        specie_id,
        svg_element_id,
        data: { [key]: value },
      });
    }
  }
}
