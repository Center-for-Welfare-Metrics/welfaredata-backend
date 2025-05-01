import ProductionModuleModel, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import SpecieModel from "@/src/models/Specie";
import mongoose from "mongoose";

interface CreateProductionModuleParams {
  name: string;
  description?: string;
  specie_id: string;
  creator_id?: string;
}

export class CreateProductionModuleUseCase {
  async execute(
    params: CreateProductionModuleParams
  ): Promise<ProductionModuleType> {
    try {
      // Verify if the specie exists
      const specie = await SpecieModel.findById(params.specie_id);

      if (!specie) {
        throw new Error("Specie not found");
      }

      // Create the production module
      const newProductionModule = await ProductionModuleModel.create({
        name: params.name,
        description: params.description,
        specie_id: new mongoose.Types.ObjectId(params.specie_id),
        creator_id: params.creator_id
          ? new mongoose.Types.ObjectId(params.creator_id)
          : undefined,
      });

      return newProductionModule;
    } catch (error: any) {
      console.error("Error creating production module:", error);
      throw new Error(error.message || "Failed to create production module");
    }
  }
}
