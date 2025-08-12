import ProductionModule, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";
import { getItemWithProcessogramUrls } from "@/src/utils/mongoose-utils";
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
  async execute(params: Params) {
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

    const productionModulesWithProcessograms = productionModules.filter(
      (pm) => pm.processograms && pm.processograms.length > 0
    );

    const productionModulesWithUrls = getItemWithProcessogramUrls(
      productionModulesWithProcessograms
    );

    return productionModulesWithUrls;
  }
}
