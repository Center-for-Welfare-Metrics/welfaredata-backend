import ProductionModule, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import { LeanDocument } from "mongoose";

type LeanProductionModule = LeanDocument<
  ProductionModuleType & {
    _id: string;
    processograms_urls_dark: string[] | undefined;
    processograms_urls_light: string[] | undefined;
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
          pipeline: [
            {
              $match: {
                status: "ready",
                is_published: true,
              },
            },
          ],
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

    const productionModulesWithUrls = productionModules.flatMap(
      (productionModule) => {
        const processogramsCount = productionModule.processogramsCount ?? 0;

        if (processogramsCount === 0) return [];

        const urlsDark = productionModule.processograms?.flatMap(
          (processogram: any) => {
            const raster_images_dark = processogram.raster_images_dark;

            if (!raster_images_dark) return [];

            const url = raster_images_dark[processogram.identifier]?.src;

            if (!url) return [];

            return [url];
          }
        );

        const urlsLight = productionModule.processograms?.flatMap(
          (processogram: any) => {
            const raster_images_light = processogram.raster_images_light;

            if (!raster_images_light) return [];

            const url = raster_images_light[processogram.identifier]?.src;

            if (!url) return [];

            return [url];
          }
        );

        return [
          {
            ...productionModule,
            processograms: undefined,
            processograms_urls_dark: urlsDark,
            processograms_urls_light: urlsLight,
          },
        ];
      }
    );

    return productionModulesWithUrls;
  }
}
