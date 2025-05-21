import SpecieModel, { SpecieType } from "@/models/Specie";

interface UpdateSpecieParams {
  id: string;
  name?: string;
  pathname?: string;
  description?: string;
}

export class UpdateSpecieUseCase {
  async execute(params: UpdateSpecieParams): Promise<SpecieType | null> {
    const { id, description, name, pathname } = params;

    try {
      // Check if the specie exists
      const existingSpecie = await SpecieModel.findById(id);

      if (!existingSpecie) {
        throw new Error("Species not found");
      }

      // If updating pathname, check if the new pathname already exists (only if it's different)
      if (params.pathname && params.pathname !== existingSpecie.pathname) {
        const pathnameExists = await SpecieModel.findOne({
          pathname: params.pathname,
          _id: { $ne: params.id }, // exclude current document
        });

        if (pathnameExists) {
          throw new Error("A species with this pathname already exists");
        }
      }

      // Update the specie
      const updateData: Partial<SpecieType> = {};

      if (params.name) updateData.name = params.name;
      if (params.pathname) updateData.pathname = params.pathname;
      if (params.description !== undefined)
        updateData.description = params.description;

      const updatedSpecie = await SpecieModel.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      );

      return updatedSpecie;
    } catch (error: any) {
      console.error("Error updating species:", error);
      throw new Error(error.message || "Failed to update species");
    }
  }
}
