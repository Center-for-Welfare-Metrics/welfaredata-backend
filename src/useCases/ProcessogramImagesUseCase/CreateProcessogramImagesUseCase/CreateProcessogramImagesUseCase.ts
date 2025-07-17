import {
  ProcessogramImagesModel,
  IProcessogramImages,
} from "@/src/models/ProcessogramImages";
import mongoose from "mongoose";

interface CreateProcessogramImagesParams {
  specie_id: string;
  processogram_id: string;
  images?: { [key: string]: any };
}

export class CreateProcessogramImagesUseCase {
  async execute(
    params: CreateProcessogramImagesParams
  ): Promise<IProcessogramImages> {
    const { specie_id, processogram_id, images = {} } = params;

    try {
      // Check if processogram images already exists for this processogram
      const existingImages = await ProcessogramImagesModel.findOne({
        processogram_id: new mongoose.Types.ObjectId(processogram_id),
      });

      if (existingImages) {
        throw new Error(
          "Processogram images already exist for this processogram"
        );
      }

      const processogramImages = new ProcessogramImagesModel({
        specie_id: new mongoose.Types.ObjectId(specie_id),
        processogram_id: new mongoose.Types.ObjectId(processogram_id),
        images,
      });

      const savedProcessogramImages = await processogramImages.save();
      return savedProcessogramImages;
    } catch (error: any) {
      console.error("Error creating processogram images:", error);
      throw new Error(error.message || "Failed to create processogram images");
    }
  }
}
