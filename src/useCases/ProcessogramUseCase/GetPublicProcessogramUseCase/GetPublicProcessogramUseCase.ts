import Specie from "@/src/models/Specie";
import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";
import ProductionModule from "@/src/models/ProductionModule";

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

    const rootElements = await ProcessogramModel.find({
      specie_id: specieId,
      production_module_id: productionModuleId,
      status: "ready",
      is_published: true,
    });

    if (!rootElements || rootElements.length === 0) {
      return [];
    }

    return rootElements;
  }
}
