import Specie, { SpecieType } from "@/src/models/Specie";
import { LeanDocument } from "mongoose";

type LeanSpecie = LeanDocument<
  SpecieType & {
    _id: string;
    processograms_urls: string[] | undefined;
  }
>;

export class GetPublicSpecieUseCase {
  async execute(): Promise<LeanSpecie[] | null> {
    const species = await Specie.find()
      .populate("processogramsCount")
      .populate("productionModulesCount")
      .populate({
        path: "processograms",
        select: "identifier raster_images",
      })
      .lean();

    if (!species) {
      console.warn("No species found");
      return null;
    }

    const speciesWithUrls = species.map((specie) => {
      const urls = specie.processograms?.flatMap((processogram: any) => {
        const raster_images = processogram.raster_images;

        if (!raster_images) return [];

        const url = raster_images[processogram.identifier].src;

        if (!url) return [];

        return [url];
      });

      return {
        ...specie,
        processograms: undefined,
        processograms_urls: urls,
      };
    });

    return speciesWithUrls;
  }
}
