import { Request, Response } from "express";
import { ListProcessogramImagesUseCase } from "./ListProcessogramImagesUseCase";

export class ListProcessogramImagesController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { pathname } = req.query;

      if (!pathname || typeof pathname !== "string") {
        res.status(400).json({
          success: false,
          message: "Pathname is required",
        });
        return;
      }

      const listProcessogramImagesUseCase = new ListProcessogramImagesUseCase();
      const processogramImages = await listProcessogramImagesUseCase.execute(
        pathname
      );

      res.status(200).json({
        success: true,
        data: processogramImages,
        count: processogramImages.length,
      });
    } catch (error: any) {
      console.error("Error in ListProcessogramImagesController.list:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to list processogram images",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const listProcessogramImagesUseCase = new ListProcessogramImagesUseCase();
      const processogramImages = await listProcessogramImagesUseCase.getById(
        id
      );

      res.status(200).json({
        success: true,
        data: processogramImages,
      });
    } catch (error: any) {
      console.error(
        "Error in ListProcessogramImagesController.getById:",
        error
      );
      res.status(404).json({
        success: false,
        message: error.message || "Failed to fetch processogram images",
      });
    }
  }

  async getByProcessogramId(req: Request, res: Response): Promise<void> {
    try {
      const { processogram_id } = req.params;

      const listProcessogramImagesUseCase = new ListProcessogramImagesUseCase();
      const processogramImages =
        await listProcessogramImagesUseCase.getByProcessogramId(
          processogram_id
        );

      res.status(200).json(processogramImages);
    } catch (error: any) {
      console.error(
        "Error in ListProcessogramImagesController.getByProcessogramId:",
        error
      );
      res.status(404).json({
        success: false,
        message: error.message || "Failed to fetch processogram images",
      });
    }
  }
}

export const listProcessogramImagesController =
  new ListProcessogramImagesController();
