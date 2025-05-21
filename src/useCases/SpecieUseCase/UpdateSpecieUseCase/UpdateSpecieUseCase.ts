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
      const existingSpecie = await SpecieModel.findById(id);

      if (!existingSpecie) {
        throw new Error("Species not found");
      }

      if (params.pathname && params.pathname !== existingSpecie.pathname) {
        const pathnameExists = await SpecieModel.findOne({
          pathname: params.pathname,
          _id: { $ne: params.id },
        });

        if (pathnameExists) {
          throw new Error("A species with this pathname already exists");
        }
      }

      const updateData: Partial<SpecieType> = {};

      if (name) updateData.name = name;
      if (pathname) updateData.pathname = pathname;
      if (description !== undefined) updateData.description = description;

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
