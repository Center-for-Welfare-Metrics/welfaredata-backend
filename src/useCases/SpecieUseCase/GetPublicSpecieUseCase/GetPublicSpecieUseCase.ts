import Specie, { SpecieType } from "@/src/models/Specie";

interface Params {
  pathname: string;
}

export class GetPublicSpecieUseCase {
  async execute(params: Params): Promise<SpecieType | null> {
    const { pathname } = params;

    const specie = await Specie.findOne({
      pathname: pathname.toLowerCase(),
    })
      .populate("processograms")
      .populate("productionModulesCount");

    if (!specie) {
      throw new Error("Specie not found");
    }

    return specie;
  }
}
