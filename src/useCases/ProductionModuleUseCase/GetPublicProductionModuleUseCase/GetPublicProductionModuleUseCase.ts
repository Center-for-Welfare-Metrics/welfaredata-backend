import ProductionModule, {
  ProductionModuleType,
} from "@/src/models/ProductionModule";

interface Params {
  id: string;
}

export class GetPublicProductionModuleUseCase {
  async execute(params: Params): Promise<ProductionModuleType | null> {
    const { id } = params;

    const productionModule = await ProductionModule.findById(id).populate(
      "processograms"
    );

    if (!productionModule) {
      throw new Error("Production module not found");
    }

    return productionModule;
  }
}
