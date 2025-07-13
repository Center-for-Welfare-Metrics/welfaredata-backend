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
      .populate("productionModulesCount")
      .populate({
        path: "processogramsCount",
        match: { status: "ready", is_published: true },
      })
      .populate({
        path: "processograms",
        select: "identifier raster_images",
        match: { status: "ready", is_published: true },
      })
      .lean();

    if (!species) {
      console.warn("No species found");
      return null;
    }

    const speciesWithUrls = species.flatMap((specie) => {
      const processogramsCount = specie.processogramsCount ?? 0;

      if (processogramsCount === 0) return [];

      const urls = specie.processograms?.flatMap((processogram: any) => {
        const raster_images = processogram.raster_images;

        if (!raster_images) return [];

        const url = raster_images[processogram.identifier].src;

        if (!url) return [];

        return [url];
      });

      return [
        {
          ...specie,
          processograms: undefined,
          processograms_urls: urls,
        },
      ];
    });

    return speciesWithUrls;
  }
}
