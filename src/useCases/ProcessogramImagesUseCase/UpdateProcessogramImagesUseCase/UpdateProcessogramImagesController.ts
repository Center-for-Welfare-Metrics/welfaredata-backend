import { Request, Response } from "express";
import { CreateProcessogramImagesUseCase } from "./UpdateProcessogramImagesUseCase";
import { upload } from "@/src/storage/google-storage";

export class UpdateProcessogramImagesController {
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { key, url, title } = req.body;
      const file = req.file;

      let s3_bucket_key: string | undefined;
      let s3_url: string | undefined;

      if (file) {
        const uploadResult = await upload(
          file.originalname,
          file.buffer,
          file.mimetype,
          "processogram-images"
        );
        s3_bucket_key = uploadResult.Key;
        s3_url = uploadResult.Location;
      }

      const updateProcessogramImagesUseCase =
        new CreateProcessogramImagesUseCase();

      const processogramImages = await updateProcessogramImagesUseCase.execute({
        id,
        key: key,
        url: s3_url || url,
        title,
        s3_bucket_key,
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
