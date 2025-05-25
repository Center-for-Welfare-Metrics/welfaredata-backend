import {
  ProcessogramDataModel,
  IProcessogramData,
} from "@/src/models/ProcessogramData";
import mongoose from "mongoose";

interface UpdateProcessogramDataParams {
  id: string;
  key: string;
  description: string;
}

export class UpdateProcessogramDataUseCase {
  async execute(
    params: UpdateProcessogramDataParams
  ): Promise<IProcessogramData | null> {
    const { id, key, description } = params;

    try {
      const existingProcessogramData = await ProcessogramDataModel.findById(id);

      if (!existingProcessogramData) {
        throw new Error("Processogram data not found");
      }

      // Check if the key exists in the data object
      if (!existingProcessogramData.data[key]) {
        throw new Error(`Key '${key}' not found in processogram data`);
      }

      // Update the description in the data object for the specific key
      const updatedData = { ...existingProcessogramData.data };
      updatedData[key] = {
        ...updatedData[key],
        description: description,
      };

      const updatedProcessogramData =
        await ProcessogramDataModel.findByIdAndUpdate(
          id,
          { data: updatedData },
          { new: true }
        );

      return updatedProcessogramData;
    } catch (error: any) {
      console.error("Error updating processogram data:", error);
      throw new Error(error.message || "Failed to update processogram data");
    }
  }
}
