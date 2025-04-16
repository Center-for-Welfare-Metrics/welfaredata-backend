import SpecieModel, { SpecieType } from "@/models/Specie";

interface CreateSpecieParams {
  name: string;
  pathname: string;
  creator_id: string;
}

export class CreateSpecieUseCase {
  async execute(params: CreateSpecieParams): Promise<SpecieType> {
    try {
      // Check if the species already exists

      // Create new species
      const newSpecie = await SpecieModel.create(params);

      return newSpecie;
    } catch (error: any) {
      console.error("Error creating species:", error);
      throw new Error(error.message || "Failed to create species");
    }
  }
}
