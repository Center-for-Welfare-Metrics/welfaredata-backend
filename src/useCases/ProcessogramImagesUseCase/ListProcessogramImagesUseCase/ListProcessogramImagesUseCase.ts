import Specie from "@/src/models/Specie";
import {
  ProcessogramImagesModel,
  IProcessogramImages,
} from "@/src/models/ProcessogramImages";
import mongoose from "mongoose";
import { CreateProcessogramImagesUseCase } from "../CreateProcessogramImagesUseCase/CreateProcessogramImagesUseCase";
import { getProcessogramById } from "@/src/implementations/mongoose/processograms/getProcessogram";

export class ListProcessogramImagesUseCase {
  async execute(pathname: string): Promise<IProcessogramImages[]> {
    try {
      const specie = await Specie.findOne({
        pathname: pathname.toLowerCase(),
      });

      const specieId = specie?._id;

      if (!specieId) {
        throw new Error("Specie not found");
      }

      const processogramImages = await ProcessogramImagesModel.find({
        specie_id: new mongoose.Types.ObjectId(specieId),
      }).sort({ createdAt: -1 });

      return processogramImages;
    } catch (error: any) {
      console.error("Error listing processogram images:", error);
      throw new Error(error.message || "Failed to list processogram images");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const processogramImages = (await ProcessogramImagesModel.findById(id)
        .populate("specie_id")
        .populate("processogram_id")
        .lean()) as IProcessogramImages & {
        specie_id: any;
        processogram_id: any;
      };

      if (!processogramImages) {
        throw new Error("Processogram images not found");
      }

      return {
        ...processogramImages,
        specie: processogramImages?.specie_id,
        specie_id: processogramImages?.specie_id?._id,
        processogram: processogramImages?.processogram_id,
        processogram_id: processogramImages?.processogram_id?._id,
      };
    } catch (error: any) {
      console.error(`Error fetching processogram images with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch processogram images");
    }
  }

  async getByProcessogramId(
    processogramId: string
  ): Promise<IProcessogramImages | null> {
    try {
      const processogramImages = await ProcessogramImagesModel.findOne({
        processogram_id: new mongoose.Types.ObjectId(processogramId),
      });

      if (!processogramImages) {
        const createProcessogramImagesUseCase =
          new CreateProcessogramImagesUseCase();

        const processogram = await getProcessogramById(processogramId);

        const specieId = processogram?.specie_id;

        if (!specieId) {
          throw new Error("Specie not found for the given processogram ID");
        }

        const createdImages = createProcessogramImagesUseCase.execute({
          processogram_id: processogramId,
          specie_id: specieId,
        });

        return createdImages;
      }

      return processogramImages;
    } catch (error: any) {
      console.error(
        `Error fetching processogram images for processogram ID ${processogramId}:`,
        error
      );
      throw new Error(error.message || "Failed to fetch processogram images");
    }
  }
}
