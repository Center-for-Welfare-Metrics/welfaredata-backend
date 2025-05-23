import Specie from "@/src/models/Specie";
import {
  ProcessogramDataModel,
  IProcessogramData,
} from "@/src/models/ProcessogramData";
import mongoose from "mongoose";

export class ListSvgDataUseCase {
  async execute(pathname: string): Promise<IProcessogramData[]> {
    try {
      const specie = await Specie.findOne({
        pathname: pathname.toLowerCase(),
      });

      const specieId = specie?._id;

      if (!specieId) {
        throw new Error("Specie not found");
      }

      const svgData = await ProcessogramDataModel.find({
        specie_id: new mongoose.Types.ObjectId(specieId),
      }).sort({ createdAt: -1 });

      return svgData;
    } catch (error: any) {
      console.error("Error listing svg data:", error);
      throw new Error(error.message || "Failed to list svg data");
    }
  }

  async getById(id: string): Promise<any | null> {
    try {
      const svgData = (await ProcessogramDataModel.findById(id)
        .populate("specie_id")
        .populate("processogram_id")
        .lean()) as IProcessogramData & {
        specie_id: any;
        processogram_id: any;
      };

      return {
        ...svgData,
        specie: svgData?.specie_id,
        specie_id: svgData?.specie_id?._id,
        svg_element: svgData?.processogram_id,
        processogram_id: svgData?.processogram_id?._id,
      };
    } catch (error: any) {
      console.error(`Error fetching svg data with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch svg data by ID");
    }
  }

  async getByProcessogramId(
    processogram_id: string
  ): Promise<IProcessogramData> {
    try {
      const svgData = await ProcessogramDataModel.findOne({
        processogram_id: new mongoose.Types.ObjectId(processogram_id),
      }).exec();

      if (!svgData) {
        throw new Error(`No SVG data found for element ID: ${processogram_id}`);
      }

      return svgData;
    } catch (error: any) {
      console.error(
        `Error fetching svg data with element ID ${processogram_id}:`,
        error
      );
      throw new Error(
        error.message || "Failed to fetch svg data by element ID"
      );
    }
  }
}
