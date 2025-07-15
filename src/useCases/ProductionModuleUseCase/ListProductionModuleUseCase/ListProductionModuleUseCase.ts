import ProductionModuleModel, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import mongoose, { LeanDocument } from "mongoose";

type LeanProductionModule = LeanDocument<
  ProductionModuleType & {
    _id: string;
    processograms_urls_dark: string[] | undefined;
    processograms_urls_light: string[] | undefined;
  }
>;

export class ListProductionModuleUseCase {
  async execute(specie_id: string): Promise<LeanProductionModule[]> {
    try {
      // Get production modules for the specified specie_id
      const productionModules = await ProductionModuleModel.find({
        specie_id: new mongoose.Types.ObjectId(specie_id),
      })
        .sort({ createdAt: -1 })
        .populate("processogramsCount")
        .populate({
          path: "processograms",
          select: "identifier raster_images_dark raster_images_light",
        })
        .lean();

      const productionModulesWithUrls = productionModules.map(
        (productionModule) => {
          const urlsDark = productionModule.processograms?.flatMap(
            (processogram: any) => {
              const raster_images_dark = processogram.raster_images_dark;

              if (!raster_images_dark) return [];

              const url = raster_images_dark[processogram.identifier]?.src;

              if (!url) return [];

              return [url];
            }
          );

          const urlsLight = productionModule.processograms?.flatMap(
            (processogram: any) => {
              const raster_images_light = processogram.raster_images_light;

              if (!raster_images_light) return [];

              const url = raster_images_light[processogram.identifier]?.src;

              if (!url) return [];

              return [url];
            }
          );

          return {
            ...productionModule,
            processograms_urls_dark: urlsDark,
            processograms_urls_light: urlsLight,
          };
        }
      );

      return productionModulesWithUrls;
    } catch (error: any) {
      console.error("Error listing production modules:", error);
      throw new Error(error.message || "Failed to list production modules");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const productionModule = (await ProductionModuleModel.findById(id)
        .populate("specie_id")
        .lean()) as ProductionModuleType & {
        specie_id: any;
      };

      return {
        ...productionModule,
        specie: productionModule?.specie_id,
        specie_id: productionModule?.specie_id?._id,
      };
    } catch (error: any) {
      console.error(`Error fetching production module with ID ${id}:`, error);
      throw new Error(
        error.message || "Failed to fetch production module by ID"
      );
    }
  }
}
