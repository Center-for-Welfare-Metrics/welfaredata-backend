import AWS from "aws-sdk";
import { ProcessogramModel, IProcessogram } from "../../../models/Processogram";

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

/**
 * Helper function to delete an object from S3
 */
async function deleteFromS3(bucketKey: string): Promise<void> {
  if (!bucketKey) return;

  try {
    await s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: bucketKey,
      })
      .promise();
    console.log(`Deleted S3 object: ${bucketKey}`);
  } catch (error) {
    console.error(`Failed to delete S3 object ${bucketKey}:`, error);
  }
}

/**
 * Helper function to delete all images associated with a processogram
 */
async function deleteProcessogramImages(
  processogram: IProcessogram
): Promise<void> {
  const deletePromises: Promise<void>[] = [];

  // Delete SVG files
  if (processogram.svg_bucket_key_light) {
    deletePromises.push(deleteFromS3(processogram.svg_bucket_key_light));
  }
  if (processogram.svg_bucket_key_dark) {
    deletePromises.push(deleteFromS3(processogram.svg_bucket_key_dark));
  }

  // Delete raster images light
  if (processogram.raster_images_light) {
    Object.values(processogram.raster_images_light).forEach((image) => {
      if (image.bucket_key) {
        deletePromises.push(deleteFromS3(image.bucket_key));
      }
    });
  }

  // Delete raster images dark
  if (processogram.raster_images_dark) {
    Object.values(processogram.raster_images_dark).forEach((image) => {
      if (image.bucket_key) {
        deletePromises.push(deleteFromS3(image.bucket_key));
      }
    });
  }

  await Promise.all(deletePromises);
}

/**
 * Find a processogram by ID and delete it along with all associated S3 images
 */
export async function deleteProcessogramById(
  processogramId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const processogram = await ProcessogramModel.findById(processogramId);

    if (!processogram) {
      return { success: false, message: "Processogram not found" };
    }

    // Delete all associated images from S3
    await deleteProcessogramImages(processogram);

    // Delete the processogram from database
    await ProcessogramModel.findByIdAndDelete(processogramId);

    return {
      success: true,
      message: "Processogram and associated images deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting processogram:", error);
    return {
      success: false,
      message: `Failed to delete processogram: ${error}`,
    };
  }
}

/**
 * Delete multiple processograms and all their associated S3 images
 */
export async function deleteMultipleProcessograms(
  processogramIds: string[]
): Promise<{
  success: boolean;
  message: string;
  results: { id: string; success: boolean; message: string }[];
}> {
  try {
    const processograms = await ProcessogramModel.find({
      _id: { $in: processogramIds },
    });

    if (processograms.length === 0) {
      return { success: false, message: "No processograms found", results: [] };
    }

    const results: { id: string; success: boolean; message: string }[] = [];

    // Process each processogram
    for (const processogram of processograms) {
      try {
        // Delete all associated images from S3
        await deleteProcessogramImages(processogram);

        // Delete the processogram from database
        await ProcessogramModel.findByIdAndDelete(processogram._id);

        results.push({
          id: processogram._id.toString(),
          success: true,
          message: "Deleted successfully",
        });
      } catch (error) {
        console.error(
          `Error deleting processogram ${processogram._id}:`,
          error
        );
        results.push({
          id: processogram._id.toString(),
          success: false,
          message: `Failed to delete: ${error}`,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    return {
      success: successCount === totalCount,
      message: `Deleted ${successCount}/${totalCount} processograms successfully`,
      results,
    };
  } catch (error) {
    console.error("Error in deleteMultipleProcessograms:", error);
    return {
      success: false,
      message: `Failed to delete processograms: ${error}`,
      results: [],
    };
  }
}
