import Specie from "@/src/models/Specie";
import { IProcessogram, ProcessogramModel } from "@/src/models/Processogram";

interface Params {
  specie: string;
}

export class GetProcessogramUseCase {
  async execute(params: Params): Promise<IProcessogram[]> {
    const { specie: pathname } = params;

    const specie = await Specie.findOne({
      pathname: pathname.toLowerCase(),
    });

    const specieId = specie?._id;

    if (!specieId) {
      throw new Error("Specie not found");
    }

    // Get all root elements for the specified specie
    const rootElements = await ProcessogramModel.find({
      specie_id: specieId,
      element_type: "root",
    });

    if (!rootElements || rootElements.length === 0) {
      return [];
    }

    return rootElements;
  }
}
