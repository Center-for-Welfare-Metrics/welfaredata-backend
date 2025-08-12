import Specie, { SpecieType } from "@/src/models/Specie";
import { getItemWithProcessogramUrls } from "@/src/utils/mongoose-utils";
import { LeanDocument } from "mongoose";

type LeanSpecie = SpecieType & {
  processograms: {
    _id: string;
    identifier: string;
    raster_images_dark?: { [key: string]: { src: string } };
    raster_images_light?: { [key: string]: { src: string } };
  }[];
};

export class GetPublicSpecieUseCase {
  async execute() {
    const species = await Specie.find<LeanSpecie>()
      .populate("productionModulesCount")
      .populate({
        path: "processogramsCount",
        match: { status: "ready", is_published: true },
      })
      .populate({
        path: "processograms",
        select: "_id identifier raster_images_dark raster_images_light",
        match: { status: "ready", is_published: true },
      })
      .lean();

    if (!species) {
      console.warn("No species found");
      return null;
    }

    const speciesWithProcessograms = species.filter(
      (specie) => specie.processograms && specie.processograms.length > 0
    );

    const speciesWithUrls = getItemWithProcessogramUrls(
      speciesWithProcessograms
    );

    return speciesWithUrls;
  }
}
