import SpecieModel, { SpecieType } from "@/models/Specie";
import { LeanDocument } from "mongoose";

type LeanSpecie = LeanDocument<
  SpecieType & {
    _id: string;
    processograms_urls: string[] | undefined;
  }
>;

type RasterImages = {
  [key: string]: {
    src: string;
  };
};

type Processogram = {
  identifier: string;
  raster_images: RasterImages;
};

export class ListSpecieUseCase {
  async execute(): Promise<LeanSpecie[]> {
    try {
      // Get species with pagination
      const species = await SpecieModel.find()
        .sort({ createdAt: -1 })
        .populate("processogramsCount")
        .populate("productionModulesCount")
        .populate({
          path: "processograms", // virtual que precisamos criar agora
          select: "identifier raster_images",
        })
        .lean();

      const speciesWithUrls = species.map((specie) => {
        const urls = specie.processograms?.map((processogram: any) => {
          const url = processogram.raster_images[processogram.identifier].src;

          return url;
        });

        return {
          ...specie,
          processograms_urls: urls,
        };
      });

      return speciesWithUrls;
    } catch (error: any) {
      console.error("Error listing species:", error);
      throw new Error(error.message || "Failed to list species");
    }
  }

  async getById(id: string): Promise<SpecieType | null> {
    try {
      const specie = await SpecieModel.findById(id)
        .populate("processogramsCount")
        .populate("productionModulesCount")
        .exec();

      if (!specie) {
        console.warn(`Specie with ID ${id} not found`);
        return null;
      }

      return specie;
    } catch (error: any) {
      console.error(`Error fetching species with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch species by ID");
    }
  }

  async getByPathname(pathname: string): Promise<SpecieType | null> {
    try {
      const specie = await SpecieModel.findOne({ pathname }).exec();
      return specie;
    } catch (error: any) {
      console.error(`Error fetching species with pathname ${pathname}:`, error);
      throw new Error(error.message || "Failed to fetch species by pathname");
    }
  }
}
