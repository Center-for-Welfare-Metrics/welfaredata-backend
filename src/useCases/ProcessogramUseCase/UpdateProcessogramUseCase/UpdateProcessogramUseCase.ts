import { ProcessogramModel, IProcessogram } from "@/src/models/Processogram";
import SpecieModel from "@/src/models/Specie";
import axios from "axios";
import mongoose from "mongoose";

interface UpdateProcessogramParams {
  id: string;
  specie_id?: string;
  production_module_id?: mongoose.Types.ObjectId | string;
  theme?: "light" | "dark";
  name?: string;
  description?: string;
  is_published?: boolean;
}

export class UpdateProcessogramUseCase {
  async execute(
    params: UpdateProcessogramParams
  ): Promise<IProcessogram | null> {
    const {
      id,
      specie_id,
      production_module_id,
      theme,
      name,
      description,
      is_published,
    } = params;

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
      if (is_published !== undefined) updateData.is_published = is_published;

      if (is_published !== existingProcessogram.is_published) {
        const clientBaseUrl = process.env.CLIENT_DOMAIN;

        const specie = await SpecieModel.findById(specie_id);

        if (specie) {
          const pathname = specie.pathname;

          const revalidateUrl = `${clientBaseUrl}/api/revalidate?specie=${pathname}&secret=${process.env.REVALIDATION_SECRET}`;

          await axios.get(revalidateUrl);
        }
      }

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
