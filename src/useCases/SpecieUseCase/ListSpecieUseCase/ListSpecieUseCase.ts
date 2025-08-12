import SpecieModel, { SpecieType } from "@/models/Specie";
import { getItemWithProcessogramUrls } from "@/src/utils/mongoose-utils";

type LeanSpecie = SpecieType & {
  processograms: {
    _id: string;
    identifier: string;
    raster_images_dark?: { [key: string]: { src: string } };
    raster_images_light?: { [key: string]: { src: string } };
  }[];
};
export class ListSpecieUseCase {
  async execute() {
    try {
      // Get species with pagination
      const species = await SpecieModel.find<LeanSpecie>()
        .sort({ createdAt: -1 })
        .populate("processogramsCount")
        .populate("productionModulesCount")
        .populate({
          path: "processograms",
          select: "identifier raster_images_dark raster_images_light",
        })
        .lean();

      const speciesWithUrls = getItemWithProcessogramUrls(species);

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
