import Specie from "@/src/models/Specie";
import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";
import ProductionModule from "@/src/models/ProductionModule";
import {
  IProcessogramData,
  ProcessogramDataModel,
} from "@/src/models/ProcessogramData";
import {
  IProcessogramQuestion,
  ProcessogramQuestionModel,
} from "@/src/models/ProcessogramQuestion";

interface Params {
  specie: string;
  productionModule: string;
  processogram: string;
}

type ProcessogramUseCaseResponse = {
  processogram: IProcessogram;
  processogramData: IProcessogramData;
  processogramQuestions: IProcessogramQuestion;
};

export class GetProcessogramBySlugUseCase {
  async execute(params: Params): Promise<ProcessogramUseCaseResponse | null> {
    const {
      specie: pathname,
      productionModule: slug,
      processogram: processogramSlug,
    } = params;

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

    const processogram = await ProcessogramModel.findOne({
      specie_id: specieId,
      production_module_id: productionModuleId,
      slug: processogramSlug.toLowerCase(),
      status: "ready",
      is_published: true,
    });

    if (!processogram) {
      throw new Error("Processogram not found");
    }

    const [processogramData, processogramQuestions] = await Promise.all([
      ProcessogramDataModel.findOne({
        processogram_id: processogram?._id,
      }),
      ProcessogramQuestionModel.findOne({
        processogram_id: processogram?._id,
      }),
    ]);

    if (!processogramData) {
      throw new Error("Processogram data not found");
    }

    if (!processogramQuestions) {
      throw new Error("Processogram questions not found");
    }

    return {
      processogram,
      processogramData,
      processogramQuestions,
    };
  }
}
