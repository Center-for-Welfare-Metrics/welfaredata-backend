import Specie from "@/src/models/Specie";
import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";
import ProductionModule from "@/src/models/ProductionModule";
import { ProcessogramDataModel } from "@/src/models/ProcessogramData";
import { getElementNameFromId } from "../CreateProcessogramUseCase/utils/extractInfoFromId";
import { PipelineStage } from "mongoose";

const processogramsToProcessogramsWithDataDescription = (
  processograms: (IProcessogram & { data: any })[]
) => {
  const processogramsWithDataDescription = processograms.flatMap((element) => {
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

  return processogramsWithDataDescription as any;
};

interface Params {
  specie: string | undefined;
  productionModule: string | undefined;
}

export class GetProcessogramUseCase {
  async execute(params: Params): Promise<IProcessogram[]> {
    const { specie: pathname, productionModule: slug } = params;

    if (!pathname) {
      const processograms = await ProcessogramModel.find({
        status: "ready",
        is_published: true,
      });
      return processograms;
    }

    const specie = await Specie.findOne({
      pathname: pathname.toLowerCase(),
    });

    const specieId = specie?._id;

    if (!specieId) {
      throw new Error("Specie not found");
    }

    const productionModule = !slug
      ? null
      : await ProductionModule.findOne({
          slug: slug.toLowerCase(),
          specie_id: specieId,
        });

    const productionModuleId = productionModule?._id;

    const aggregation: PipelineStage[] = [];

    if (productionModuleId) {
      aggregation.push({
        $match: {
          specie_id: specieId,
          production_module_id: productionModuleId,
          status: "ready",
          is_published: true,
        },
      });
    } else {
      aggregation.push({
        $match: {
          specie_id: specieId,
          status: "ready",
          is_published: true,
        },
      });
    }

    aggregation.push(
      ...[
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
      ]
    );

    const processograms = await ProcessogramModel.aggregate(aggregation);

    if (!processograms || processograms.length === 0) {
      return [];
    }

    const processogramsWithDataDescription =
      processogramsToProcessogramsWithDataDescription(processograms);

    return processogramsWithDataDescription;
  }
}
