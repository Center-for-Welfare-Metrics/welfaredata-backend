import {
  ProcessogramImagesModel,
  IProcessogramImages,
} from "@/src/models/ProcessogramImages";

interface CreateProcessogramImagesParams {
  id: string;
  key: string;
  url: string;
}

interface DeleteProcessogramImageParams {
  id: string;
  key: string;
  url: string;
}

interface ToggleAutoSearchParams {
  processogramId: string;
  autoSearch: boolean;
}

export class CreateProcessogramImagesUseCase {
  async execute(
    params: CreateProcessogramImagesParams
  ): Promise<IProcessogramImages | null> {
    const { id, key, url } = params;

    try {
      const existingProcessogramImages = await ProcessogramImagesModel.findOne({
        processogram_id: id,
      });

      if (!existingProcessogramImages) {
        throw new Error("Processogram images not found");
      }

      // Add the new images to the existing images object
      const updatedImages = { ...existingProcessogramImages.images };

      const imagesKey = updatedImages[key] || [];

      updatedImages[key] = [
        ...imagesKey,
        {
          source: "url-only",
          url,
          uploaded_at: new Date(),
        },
      ];

      const updatedProcessogramImages =
        await ProcessogramImagesModel.findByIdAndUpdate(
          existingProcessogramImages._id,
          { images: updatedImages },
          { new: true }
        );

      return updatedProcessogramImages;
    } catch (error: any) {
      console.error("Error creating processogram images:", error);
      throw new Error(error.message || "Failed to create processogram images");
    }
  }

  async delete(
    params: DeleteProcessogramImageParams
  ): Promise<IProcessogramImages | null> {
    const { id, key, url } = params;

    try {
      const existingProcessogramImages = await ProcessogramImagesModel.findOne({
        processogram_id: id,
      });

      if (!existingProcessogramImages) {
        throw new Error("Processogram images not found");
      }

      const updatedImages = { ...existingProcessogramImages.images };

      if (!updatedImages[key]) {
        throw new Error(`No images found for key: ${key}`);
      }

      // Filter out the image with the matching URL
      const filteredImages = updatedImages[key].filter(
        (image) => image.url !== url
      );

      if (filteredImages.length === updatedImages[key].length) {
        throw new Error(`Image with URL ${url} not found`);
      }

      // If no images left for this key, remove the key entirely
      if (filteredImages.length === 0) {
        delete updatedImages[key];
      } else {
        updatedImages[key] = filteredImages;
      }

      const updatedProcessogramImages =
        await ProcessogramImagesModel.findByIdAndUpdate(
          existingProcessogramImages._id,
          { images: updatedImages },
          { new: true }
        );

      return updatedProcessogramImages;
    } catch (error: any) {
      console.error("Error deleting processogram image:", error);
      throw new Error(error.message || "Failed to delete processogram image");
    }
  }

  async updateAutoSearch(
    params: ToggleAutoSearchParams
  ): Promise<IProcessogramImages | null> {
    const { processogramId, autoSearch } = params;

    try {
      const existingProcessogramImages = await ProcessogramImagesModel.findOne({
        processogram_id: processogramId,
      });

      if (!existingProcessogramImages) {
        throw new Error("Processogram images not found");
      }

      const updatedProcessogramImages =
        await ProcessogramImagesModel.findByIdAndUpdate(
          existingProcessogramImages._id,
          { autoSearch: autoSearch },
          { new: true }
        );

      return updatedProcessogramImages;
    } catch (error: any) {
      console.error("Error updating auto search:", error);
      throw new Error(error.message || "Failed to update auto search");
    }
  }
}
