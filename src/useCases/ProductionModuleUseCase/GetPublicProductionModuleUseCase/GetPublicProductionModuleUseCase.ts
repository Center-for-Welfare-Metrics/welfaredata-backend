import ProductionModule, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import { LeanDocument } from "mongoose";

type LeanProductionModule = LeanDocument<
  ProductionModuleType & {
    _id: string;
    processograms_urls: string[] | undefined;
  }
>;

interface Params {
  pathname: string;
}

export class GetPublicProductionModuleUseCase {
  async execute(params: Params): Promise<LeanProductionModule[] | null> {
    const { pathname } = params;

    const productionModules = await ProductionModule.aggregate([
      {
        $lookup: {
          from: "species",
          localField: "specie_id",
          foreignField: "_id",
          as: "specie",
        },
      },
      {
        $unwind: "$specie",
      },
      {
        $match: {
          "specie.pathname": pathname,
        },
      },
      {
        $lookup: {
          from: "processograms",
          localField: "_id",
          foreignField: "production_module_id",
          as: "processograms",
        },
      },
      {
        $addFields: {
          processogramsCount: { $size: "$processograms" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!productionModules) {
      throw new Error("Production module not found");
    }

    const productionModulesWithUrls = productionModules.map(
      (productionModule) => {
        const urls = productionModule.processograms?.flatMap(
          (processogram: any) => {
            const raster_images = processogram.raster_images;

            if (!raster_images) return [];

            const url = raster_images[processogram.identifier].src;

            if (!url) return [];

            return [url];
          }
        );

        return {
          ...productionModule,
          processograms: undefined,
          processograms_urls: urls,
        };
      }
    );

    return productionModulesWithUrls;
  }
}
