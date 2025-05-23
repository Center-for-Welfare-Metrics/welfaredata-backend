import { ProcessogramModel, IProcessogram } from "@/src/models/Processogram";
import mongoose from "mongoose";

interface UpdateProcessogramParams {
  id: string;
  specie_id?: string;
  production_module_id?: mongoose.Types.ObjectId | string;
  theme?: "light" | "dark";
  name?: string;
  description?: string;
}

export class UpdateProcessogramUseCase {
  async execute(
    params: UpdateProcessogramParams
  ): Promise<IProcessogram | null> {
    const { id, specie_id, production_module_id, theme, name, description } =
      params;

    try {
      const existingProcessogram = await ProcessogramModel.findById(id);

      if (!existingProcessogram) {
        throw new Error("Processogram not found");
      }

      const updateData: Partial<IProcessogram> = {};

      if (specie_id) updateData.specie_id = specie_id;
      if (production_module_id)
        updateData.production_module_id =
          production_module_id as mongoose.Types.ObjectId;
      if (theme) updateData.theme = theme;
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      const updatedProcessogram = await ProcessogramModel.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      );

      return updatedProcessogram;
    } catch (error: any) {
      console.error("Error updating processogram:", error);
      throw new Error(error.message || "Failed to update processogram");
    }
  }
}
