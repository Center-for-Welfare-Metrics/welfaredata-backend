import ProductionModuleModel, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import mongoose from "mongoose";

export class ListProductionModuleUseCase {
  async execute(specie_id: string): Promise<ProductionModuleType[]> {
    try {
      // Get production modules for the specified specie_id
      const productionModules = await ProductionModuleModel.find({
        specie_id: new mongoose.Types.ObjectId(specie_id),
      }).sort({ createdAt: -1 });

      return productionModules;
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
