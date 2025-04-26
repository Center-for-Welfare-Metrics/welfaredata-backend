import SvgData, { ISvgData } from "@/src/models/SvgData";
import mongoose from "mongoose";

export class ListSvgDataUseCase {
  async execute(specie_id: string): Promise<ISvgData[]> {
    try {
      // Get svg data with the specified specie_id
      const svgData = await SvgData.find({
        specie_id: new mongoose.Types.ObjectId(specie_id),
      }).sort({ createdAt: -1 });

      return svgData;
    } catch (error: any) {
      console.error("Error listing svg data:", error);
      throw new Error(error.message || "Failed to list svg data");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const svgData = (await SvgData.findById(id)
        .populate("specie_id")
        .populate("svg_element_id")
        .lean()) as ISvgData & { specie_id: any; svg_element_id: any };

      return {
        ...svgData,
        specie: svgData?.specie_id,
        specie_id: svgData?.specie_id?._id,
        svg_element: svgData?.svg_element_id,
        svg_element_id: svgData?.svg_element_id?._id,
      };
    } catch (error: any) {
      console.error(`Error fetching svg data with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch svg data by ID");
    }
  }

  async getBySvgElementId(svg_element_id: string): Promise<ISvgData> {
    try {
      const svgData = await SvgData.findOne({
        svg_element_id: new mongoose.Types.ObjectId(svg_element_id),
      }).exec();

      if (!svgData) {
        throw new Error(`No SVG data found for element ID: ${svg_element_id}`);
      }

      return svgData;
    } catch (error: any) {
      console.error(
        `Error fetching svg data with element ID ${svg_element_id}:`,
        error
      );
      throw new Error(
        error.message || "Failed to fetch svg data by element ID"
      );
    }
  }
}
