import { Request, Response } from "express";
import { CreateProcessogramImagesUseCase } from "./CreateProcessogramImagesUseCase";

export class CreateProcessogramImagesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { production_system_name, specie_id, processogram_id, images } =
        req.body;

      const createProcessogramImagesUseCase =
        new CreateProcessogramImagesUseCase();
      const processogramImages = await createProcessogramImagesUseCase.execute({
        production_system_name,
        specie_id,
        processogram_id,
        images,
      });

      res.status(201).json({
        success: true,
        data: processogramImages,
        message: "Processogram images created successfully",
      });
    } catch (error: any) {
      console.error("Error in CreateProcessogramImagesController:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create processogram images",
      });
    }
  }
}

export const createProcessogramImagesController =
  new CreateProcessogramImagesController();
