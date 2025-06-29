import { ProcessogramModel, IProcessogram } from "@/src/models/Processogram";
import { ProcessogramDataModel } from "@/src/models/ProcessogramData";
import { ProcessogramQuestionModel } from "@/src/models/ProcessogramQuestion";
import mongoose from "mongoose";

interface DeleteProcessogramParams {
  id: string;
}

export class DeleteProcessogramUseCase {
  async execute(
    params: DeleteProcessogramParams
  ): Promise<{ success: boolean; message: string }> {
    const { id } = params;

    try {
      const existingProcessogram = await ProcessogramModel.findById(id);

      if (!existingProcessogram) {
        throw new Error("Processogram not found");
      }

      // Delete related processogram data if this is the root element
      const deletedProcessogramData = await ProcessogramDataModel.deleteMany({
        processogram_id: new mongoose.Types.ObjectId(id),
      });

      // Delete related processogram questions
      const deletedProcessogramQuestions =
        await ProcessogramQuestionModel.deleteMany({
          processogram_id: new mongoose.Types.ObjectId(id),
        });

      // Delete the processogram itself
      await ProcessogramModel.findByIdAndDelete(id);

      return {
        success: true,
        message: `Processogram and all related data deleted successfully. Removed: ${deletedProcessogramData.deletedCount} processogram data entries, ${deletedProcessogramQuestions.deletedCount} processogram questions.`,
      };
    } catch (error: any) {
      console.error("Error deleting processogram:", error);
      throw new Error(error.message || "Failed to delete processogram");
    }
  }
}
