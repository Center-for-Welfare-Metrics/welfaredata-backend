import SvgElement, { ISvgElement } from "src/models/SvgElement";

interface Params {
  specie: string;
}

export class GetElementUseCase {
  async execute(params: Params): Promise<ISvgElement[]> {
    const { specie } = params;

    // Get all root elements for the specified specie
    const rootElements = await SvgElement.find({
      specie: specie.toLowerCase(),
      element_type: "root",
    });

    if (!rootElements || rootElements.length === 0) {
      return [];
    }

    return rootElements;
  }
}
