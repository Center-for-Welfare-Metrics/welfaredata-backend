import Specie from "@/src/models/Specie";
import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";
import ProductionModule from "@/src/models/ProductionModule";
import { ProcessogramDataModel } from "@/src/models/ProcessogramData";
import { getElementNameFromId } from "../CreateProcessogramUseCase/utils/extractInfoFromId";

interface Params {
  specie: string;
  productionModule: string;
}

export class GetProcessogramUseCase {
  async execute(params: Params): Promise<IProcessogram[]> {
    const { specie: pathname, productionModule: slug } = params;

    const specie = await Specie.findOne({
      pathname: pathname.toLowerCase(),
    });

    const specieId = specie?._id;

    if (!specieId) {
      throw new Error("Specie not found");
    }

    const productionModule = await ProductionModule.findOne({
      slug: slug.toLowerCase(),
      specie_id: specieId,
    });

    if (!productionModule) {
      throw new Error("Production module not found");
    }

    const productionModuleId = productionModule._id;

    const rootElements = await ProcessogramModel.aggregate([
      {
        $match: {
          specie_id: specieId,
          production_module_id: productionModuleId,
          status: "ready",
          is_published: true,
        },
      },
      {
        $lookup: {
          from: ProcessogramDataModel.collection.name,
          localField: "_id",
          foreignField: "processogram_id",
          as: "processogramData",
        },
      },
      {
        $addFields: {
          data: {
            $arrayElemAt: ["$processogramData.data", 0],
          },
        },
      },
      {
        $project: {
          processogramData: 0,
        },
      },
    ]);

    if (!rootElements || rootElements.length === 0) {
      return [];
    }

    const processogramsWithDataDescription = rootElements.flatMap((element) => {
      const identifier = element.identifier;
      if (!identifier) return [];

      const realId = getElementNameFromId(identifier);

      const dataEntry = element.data[realId];

      const { data, ...elementWithoutData } = element;

      if (!dataEntry) return [elementWithoutData];

      return [
        {
          ...elementWithoutData,
          dataDescription: dataEntry.description,
        },
      ];
    });

    return processogramsWithDataDescription;
  }
}
