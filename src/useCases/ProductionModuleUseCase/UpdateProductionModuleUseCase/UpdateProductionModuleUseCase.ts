import ProductionModuleModel, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import SpecieModel from "@/src/models/Specie";
import mongoose from "mongoose";

interface UpdateProductionModuleParams {
  id: string;
  name?: string;
  description?: string;
  specie_id?: string;
}

export class UpdateProductionModuleUseCase {
  async execute(
    params: UpdateProductionModuleParams
  ): Promise<ProductionModuleType | null> {
    const { id, name, description, specie_id } = params;

    try {
      const existingModule = await ProductionModuleModel.findById(id);

      if (!existingModule) {
        throw new Error("Production module not found");
      }

      if (specie_id && specie_id !== existingModule.specie_id.toString()) {
        const specie = await SpecieModel.findById(specie_id);

        if (!specie) {
          throw new Error("Specie not found");
        }
      }

      const updateData: Partial<ProductionModuleType> = {};

      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (specie_id)
        updateData.specie_id = new mongoose.Types.ObjectId(specie_id);

      const updatedModule = await ProductionModuleModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      return updatedModule;
    } catch (error: any) {
      console.error("Error updating production module:", error);
      throw new Error(error.message || "Failed to update production module");
    }
  }
}
