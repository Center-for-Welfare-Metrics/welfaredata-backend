import SpecieModel from "@/models/Specie";
import ProductionModuleModel from "@/models/ProductionModule";
import { ProcessogramModel } from "@/models/Processogram";
import { ProcessogramDataModel } from "@/models/ProcessogramData";
import { ProcessogramQuestionModel } from "@/models/ProcessogramQuestion";

interface DeleteSpecieParams {
  id: string;
}

export class DeleteSpecieUseCase {
  async execute(
    params: DeleteSpecieParams
  ): Promise<{ success: boolean; message: string }> {
    const { id } = params;

    try {
      const existingSpecie = await SpecieModel.findById(id);

      if (!existingSpecie) {
        throw new Error("Species not found");
      }

      const deletedProductionModules = await ProductionModuleModel.deleteMany({
        specie_id: id,
      });

      const deletedProcessogramData = await ProcessogramDataModel.deleteMany({
        specie_id: id,
      });

      const deletedProcessogramQuestions =
        await ProcessogramQuestionModel.deleteMany({
          specie_id: id,
        });

      const deletedProcessograms = await ProcessogramModel.deleteMany({
        specie_id: id,
      });

      await SpecieModel.findByIdAndDelete(id);

      return {
        success: true,
        message: `Species and all related data deleted successfully. Removed: ${deletedProductionModules.deletedCount} production modules, ${deletedProcessogramData.deletedCount} processogram data entries, ${deletedProcessogramQuestions.deletedCount} processogram questions, and ${deletedProcessograms.deletedCount} processograms.`,
      };
    } catch (error: any) {
      console.error("Error deleting species:", error);
      throw new Error(error.message || "Failed to delete species");
    }
  }
}
