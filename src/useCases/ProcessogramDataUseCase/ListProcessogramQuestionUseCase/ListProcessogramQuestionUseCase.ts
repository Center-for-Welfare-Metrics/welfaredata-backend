import Specie from "@/src/models/Specie";
import {
  ProcessogramQuestionModel,
  IProcessogramQuestion,
} from "@/src/models/ProcessogramQuestion";
import mongoose from "mongoose";

export class ListProcessogramQuestionUseCase {
  async execute(pathname: string): Promise<IProcessogramQuestion[]> {
    try {
      const specie = await Specie.findOne({
        pathname: pathname.toLowerCase(),
      });

      const specieId = specie?._id;

      if (!specieId) {
        throw new Error("Specie not found");
      }

      const questionData = await ProcessogramQuestionModel.find({
        specie_id: new mongoose.Types.ObjectId(specieId),
      }).sort({ createdAt: -1 });

      return questionData;
    } catch (error: any) {
      console.error("Error listing processogram questions:", error);
      throw new Error(error.message || "Failed to list processogram questions");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const questionData = (await ProcessogramQuestionModel.findById(id)
        .populate("specie_id")
        .populate("processogram_id")
        .lean()) as IProcessogramQuestion & {
        specie_id: any;
        processogram_id: any;
      };

      return {
        ...questionData,
        specie: questionData?.specie_id,
        specie_id: questionData?.specie_id?._id,
        svg_element: questionData?.processogram_id,
        processogram_id: questionData?.processogram_id?._id,
      };
    } catch (error: any) {
      console.error(
        `Error fetching processogram question with ID ${id}:`,
        error
      );
      throw new Error(
        error.message || "Failed to fetch processogram question by ID"
      );
    }
  }

  async getByProcessogramId(
    processogram_id: string
  ): Promise<IProcessogramQuestion> {
    try {
      const questionData = await ProcessogramQuestionModel.findOne({
        processogram_id: new mongoose.Types.ObjectId(processogram_id),
      }).exec();

      if (!questionData) {
        throw new Error(
          `No question data found for element ID: ${processogram_id}`
        );
      }

      return questionData;
    } catch (error: any) {
      console.error(
        `Error fetching processogram question with element ID ${processogram_id}:`,
        error
      );
      throw new Error(
        error.message || "Failed to fetch processogram question by element ID"
      );
    }
  }
}
