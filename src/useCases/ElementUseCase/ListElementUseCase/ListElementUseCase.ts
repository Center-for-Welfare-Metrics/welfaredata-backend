import SvgElement, { ISvgElement } from "@/src/models/SvgElement";
import mongoose from "mongoose";

export class ListElementUseCase {
  async execute(specie_id: string): Promise<ISvgElement[]> {
    try {
      // Get elements with the specified specie_id
      const elements = await SvgElement.find({
        specie_id: new mongoose.Types.ObjectId(specie_id),
        element_type: "root",
      }).sort({ createdAt: -1 });

      return elements;
    } catch (error: any) {
      console.error("Error listing elements:", error);
      throw new Error(error.message || "Failed to list elements");
    }
  }

  async getById(id: string): Promise<ISvgElement | null> {
    try {
      const element = await SvgElement.findById(id).exec();
      return element;
    } catch (error: any) {
      console.error(`Error fetching element with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch element by ID");
    }
  }

  async getByRootId(rootId: string): Promise<ISvgElement[]> {
    try {
      const elements = await SvgElement.find({
        root_id: new mongoose.Types.ObjectId(rootId),
      }).exec();
      return elements;
    } catch (error: any) {
      console.error(`Error fetching elements with root ID ${rootId}:`, error);
      throw new Error(error.message || "Failed to fetch elements by root ID");
    }
  }
}
