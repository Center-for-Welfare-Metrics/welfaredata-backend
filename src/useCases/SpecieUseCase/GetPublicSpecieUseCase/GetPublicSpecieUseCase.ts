import Specie, { SpecieType } from "@/src/models/Specie";
import { LeanDocument } from "mongoose";

type LeanSpecie = LeanDocument<
  SpecieType & {
    _id: string;
    processograms_urls_dark: string[] | undefined;
    processograms_urls_light: string[] | undefined;
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
        select: "identifier raster_images_dark raster_images_light",
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

      return [
        {
          ...specie,
          processograms: undefined,
          processograms_urls_dark: urlsDark,
          processograms_urls_light: urlsLight,
        },
      ];
    });

    return speciesWithUrls;
  }
}
