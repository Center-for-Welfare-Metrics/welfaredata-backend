import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";
import mongoose from "mongoose";

export class ListProcessogramUseCase {
  async execute(specie_id: string): Promise<IProcessogram[]> {
    try {
      // Get elements with the specified specie_id
      const elements = await ProcessogramModel.find({
        specie_id: new mongoose.Types.ObjectId(specie_id),
        element_type: "root",
      }).sort({ createdAt: -1 });

      return elements;
    } catch (error: any) {
      console.error("Error listing elements:", error);
      throw new Error(error.message || "Failed to list elements");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const element = (await ProcessogramModel.findById(id)
        .populate("specie_id")
        .lean()) as IProcessogram & { specie_id: any };

      return {
        ...element,
        specie: element?.specie_id,
        specie_id: element?.specie_id?._id,
      };
    } catch (error: any) {
      console.error(`Error fetching element with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch element by ID");
    }
  }

  async getByRootId(rootId: string): Promise<IProcessogram[]> {
    try {
      const elements = await ProcessogramModel.find({
        root_id: new mongoose.Types.ObjectId(rootId),
      }).exec();
      return elements;
    } catch (error: any) {
      console.error(`Error fetching elements with root ID ${rootId}:`, error);
      throw new Error(error.message || "Failed to fetch elements by root ID");
    }
  }
}
