import SpecieModel, { SpecieType } from "@/models/Specie";
import { LeanDocument } from "mongoose";

type LeanSpecie = LeanDocument<
  SpecieType & {
    _id: string;
    processograms_urls_dark: string[] | undefined;
    processograms_urls_light: string[] | undefined;
  }
>;

export class ListSpecieUseCase {
  async execute(): Promise<LeanSpecie[]> {
    try {
      // Get species with pagination
      const species = await SpecieModel.find()
        .sort({ createdAt: -1 })
        .populate("processogramsCount")
        .populate("productionModulesCount")
        .populate({
          path: "processograms",
          select: "identifier raster_images_dark raster_images_light",
        })
        .lean();

      const speciesWithUrls = species.map((specie) => {
        const urlsDark = specie.processograms?.flatMap((processogram: any) => {
          const raster_images_dark = processogram.raster_images_dark;

          if (!raster_images_dark) return [];

          const url = raster_images_dark[processogram.identifier]?.src;

          if (!url) return [];

          return [url];
        });

        const urlsLight = specie.processograms?.flatMap((processogram: any) => {
          const raster_images_light = processogram.raster_images_light;

          if (!raster_images_light) return [];

          const url = raster_images_light[processogram.identifier]?.src;

          if (!url) return [];

          return [url];
        });

        return {
          ...specie,
          processograms_urls_dark: urlsDark,
          processograms_urls_light: urlsLight,
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
