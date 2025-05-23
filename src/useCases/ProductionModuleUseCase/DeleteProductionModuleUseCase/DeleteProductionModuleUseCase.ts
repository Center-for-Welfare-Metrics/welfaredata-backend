import ProductionModuleModel from "@/models/ProductionModule";
import { ProcessogramModel } from "@/models/Processogram";
import { ProcessogramDataModel } from "@/models/ProcessogramData";
import { ProcessogramQuestionModel } from "@/models/ProcessogramQuestion";
import mongoose from "mongoose";

interface DeleteProductionModuleParams {
  id: string;
}

export class DeleteProductionModuleUseCase {
  async execute(
    params: DeleteProductionModuleParams
  ): Promise<{ success: boolean; message: string }> {
    const { id } = params;

    try {
      const existingProductionModule = await ProductionModuleModel.findById(id);

      if (!existingProductionModule) {
        throw new Error("Production module not found");
      }

      const processograms = await ProcessogramModel.find({
        production_module_id: new mongoose.Types.ObjectId(id),
      });

      const processogramIds = processograms.map((proc) => proc._id);

      const deletedProcessogramData = await ProcessogramDataModel.deleteMany({
        processogram_id: { $in: processogramIds },
      });

      const deletedProcessogramQuestions =
        await ProcessogramQuestionModel.deleteMany({
          processogram_id: { $in: processogramIds },
        });

      const deletedProcessograms = await ProcessogramModel.deleteMany({
        production_module_id: new mongoose.Types.ObjectId(id),
      });

      await ProductionModuleModel.findByIdAndDelete(id);

      return {
        success: true,
        message: `Production module and all related data deleted successfully. Removed: ${deletedProcessogramData.deletedCount} processogram data entries, ${deletedProcessogramQuestions.deletedCount} processogram questions, and ${deletedProcessograms.deletedCount} processograms.`,
      };
    } catch (error: any) {
      console.error("Error deleting production module:", error);
      throw new Error(error.message || "Failed to delete production module");
    }
  }
}
