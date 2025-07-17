import {
  ProcessogramImagesModel,
  IProcessogramImages,
} from "@/src/models/ProcessogramImages";
import { deleteProcessogramRasterImages } from "@/src/implementations/mongoose/processograms/deleteProcessogramsAndImages";

export class DeleteProcessogramImagesUseCase {
  async execute(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const processogramImages = await ProcessogramImagesModel.findById(id);

      if (!processogramImages) {
        return { success: false, message: "Processogram images not found" };
      }

      // Delete S3 images if they exist
      if (
        processogramImages.images &&
        Object.keys(processogramImages.images).length > 0
      ) {
        const rasterImages: Record<string, { bucket_key: string }> = {};

        // Convert images to the format expected by deleteProcessogramRasterImages
        Object.entries(processogramImages.images).forEach(
          ([key, imageEntry]) => {
            if ("s3_bucket_key" in imageEntry && imageEntry.s3_bucket_key) {
              rasterImages[key] = { bucket_key: imageEntry.s3_bucket_key };
            }
          }
        );

        if (Object.keys(rasterImages).length > 0) {
          await deleteProcessogramRasterImages(rasterImages);
        }
      }

      // Delete the processogram images document from database
      await ProcessogramImagesModel.findByIdAndDelete(id);

      return {
        success: true,
        message:
          "Processogram images and associated S3 files deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting processogram images:", error);
      return {
        success: false,
        message: `Failed to delete processogram images: ${error.message}`,
      };
    }
  }

  async deleteByProcessogramId(
    processogramId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const processogramImages = await ProcessogramImagesModel.findOne({
        processogram_id: processogramId,
      });

      if (!processogramImages) {
        return { success: false, message: "Processogram images not found" };
      }

      return await this.execute(processogramImages._id.toString());
    } catch (error: any) {
      console.error(
        "Error deleting processogram images by processogram ID:",
        error
      );
      return {
        success: false,
        message: `Failed to delete processogram images: ${error.message}`,
      };
    }
  }

  async deleteMultiple(ids: string[]): Promise<{
    success: boolean;
    message: string;
    results: { id: string; success: boolean; message: string }[];
  }> {
    try {
      const results: { id: string; success: boolean; message: string }[] = [];

      for (const id of ids) {
        const result = await this.execute(id);
        results.push({
          id,
          success: result.success,
          message: result.message,
        });
      }

      const successCount = results.filter((r) => r.success).length;
      const totalCount = results.length;

      return {
        success: successCount === totalCount,
        message: `Deleted ${successCount}/${totalCount} processogram images successfully`,
        results,
      };
    } catch (error: any) {
      console.error("Error in deleteMultiple:", error);
      return {
        success: false,
        message: `Failed to delete processogram images: ${error.message}`,
        results: [],
      };
    }
  }
}
