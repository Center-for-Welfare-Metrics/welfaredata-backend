import { Request, Response } from "express";
import { DeleteProcessogramImagesUseCase } from "./DeleteProcessogramImagesUseCase";

export class DeleteProcessogramImagesController {
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleteProcessogramImagesUseCase =
        new DeleteProcessogramImagesUseCase();
      const result = await deleteProcessogramImagesUseCase.execute(id);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      console.error(
        "Error in DeleteProcessogramImagesController.delete:",
        error
      );
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete processogram images",
      });
    }
  }

  async deleteByProcessogramId(req: Request, res: Response): Promise<void> {
    try {
      const { processogram_id } = req.params;

      const deleteProcessogramImagesUseCase =
        new DeleteProcessogramImagesUseCase();
      const result =
        await deleteProcessogramImagesUseCase.deleteByProcessogramId(
          processogram_id
        );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      console.error(
        "Error in DeleteProcessogramImagesController.deleteByProcessogramId:",
        error
      );
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete processogram images",
      });
    }
  }

  async deleteMultiple(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: "Array of IDs is required",
        });
        return;
      }

      const deleteProcessogramImagesUseCase =
        new DeleteProcessogramImagesUseCase();
      const result = await deleteProcessogramImagesUseCase.deleteMultiple(ids);

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.results,
      });
    } catch (error: any) {
      console.error(
        "Error in DeleteProcessogramImagesController.deleteMultiple:",
        error
      );
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete processogram images",
      });
    }
  }
}

export const deleteProcessogramImagesController =
  new DeleteProcessogramImagesController();
