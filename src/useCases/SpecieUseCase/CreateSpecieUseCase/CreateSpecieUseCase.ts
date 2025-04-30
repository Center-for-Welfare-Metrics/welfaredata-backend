import SpecieModel, { SpecieType } from "@/models/Specie";
import { generateAndSaveSpecieData } from "./utils/generateAndSaveSpecieData";

interface CreateSpecieParams {
  name: string;
  pathname: string;
  creator_id: string;
}

export class CreateSpecieUseCase {
  async execute(params: CreateSpecieParams): Promise<SpecieType> {
    try {
      const newSpecie = await SpecieModel.create(params);

      generateAndSaveSpecieData({
        specieName: params.name,
        _id: newSpecie._id,
      });

      return newSpecie;
    } catch (error: any) {
      console.error("Error creating species:", error);
      throw new Error(error.message || "Failed to create species");
    }
  }
}
