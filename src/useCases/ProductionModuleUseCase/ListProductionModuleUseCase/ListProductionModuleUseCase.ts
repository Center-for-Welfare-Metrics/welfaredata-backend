import ProductionModuleModel, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import { getItemWithProcessogramUrls } from "@/src/utils/mongoose-utils";
import mongoose from "mongoose";

type LeanProductionModule = ProductionModuleType & {
  processograms: {
    _id: string;
    identifier: string;
    raster_images_dark?: { [key: string]: { src: string } };
    raster_images_light?: { [key: string]: { src: string } };
  }[];
};

export class ListProductionModuleUseCase {
  async execute(specie_id: string) {
    try {
      const productionModules =
        await ProductionModuleModel.find<LeanProductionModule>({
          specie_id: new mongoose.Types.ObjectId(specie_id),
        })
          .sort({ createdAt: -1 })
          .populate("processogramsCount")
          .populate({
            path: "processograms",
            select: "identifier raster_images_dark raster_images_light",
          })
          .lean();

      const productionModulesWithUrls =
        getItemWithProcessogramUrls(productionModules);

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
