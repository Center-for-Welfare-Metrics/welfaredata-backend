import { Request, Response } from "express";
import { CreateProcessogramImagesUseCase } from "./UpdateProcessogramImagesUseCase";

export class UpdateProcessogramImagesController {
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { key, url, title } = req.body;

      const updateProcessogramImagesUseCase =
        new CreateProcessogramImagesUseCase();
      const processogramImages = await updateProcessogramImagesUseCase.execute({
        id,
        key,
        url,
        title,
      });

      res.status(200).json({
        success: true,
        data: processogramImages,
        message: "Processogram image updated successfully",
      });
    } catch (error: any) {
      console.error(
        "Error in UpdateProcessogramImagesController.update:",
        error
      );
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update processogram image",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { key, url } = req.body;

      const updateProcessogramImagesUseCase =
        new CreateProcessogramImagesUseCase();
      const processogramImages = await updateProcessogramImagesUseCase.delete({
        id,
        key,
        url,
      });

      res.status(200).json({
        success: true,
        data: processogramImages,
        message: "Processogram image deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "Error in UpdateProcessogramImagesController.delete:",
        error
      );
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete processogram image",
      });
    }
  }

  async updateAutoSearch(req: Request, res: Response): Promise<void> {
    try {
      const { id: processogramId } = req.params;
      const { autoSearch } = req.body;

      const updateProcessogramImagesUseCase =
        new CreateProcessogramImagesUseCase();
      const processogramImages =
        await updateProcessogramImagesUseCase.updateAutoSearch({
          processogramId,
          autoSearch,
        });

      res.status(200).json({
        success: true,
        data: processogramImages,
        message: "Auto search updated successfully",
      });
    } catch (error: any) {
      console.error(
        "Error in UpdateProcessogramImagesController.updateAutoSearch:",
        error
      );
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update auto search",
      });
    }
  }
}

export const updateProcessogramImagesController =
  new UpdateProcessogramImagesController();
