import SpecieModel, { SpecieType } from "@/models/Specie";

export class ListSpecieUseCase {
  async execute(): Promise<SpecieType[]> {
    try {
      // Get species with pagination
      const species = await SpecieModel.find().sort({ createdAt: -1 });

      return species;
    } catch (error: any) {
      console.error("Error listing species:", error);
      throw new Error(error.message || "Failed to list species");
    }
  }

  async getById(id: string): Promise<SpecieType | null> {
    try {
      const specie = await SpecieModel.findById(id).exec();
      return specie;
    } catch (error: any) {
      console.error(`Error fetching species with ID ${id}:`, error);
      throw new Error(error.message || "Failed to fetch species by ID");
    }
  }

  async getByPathname(pathname: string): Promise<SpecieType | null> {
    try {
      const specie = await SpecieModel.findOne({ pathname }).exec();
      return specie;
    } catch (error: any) {
      console.error(`Error fetching species with pathname ${pathname}:`, error);
      throw new Error(error.message || "Failed to fetch species by pathname");
    }
  }
}
