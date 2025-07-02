import { ProcessogramModel, IProcessogram } from "@/src/models/Processogram";
import SpecieModel from "@/src/models/Specie";
import axios from "axios";
import mongoose from "mongoose";
import { CreateProcessogramUseCase } from "../CreateProcessogramUseCase/CreateProcessogramUseCase";
interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
interface UpdateProcessogramParams {
  id: string;
  specie_id?: string;
  production_module_id?: mongoose.Types.ObjectId | string;
  name?: string;
  description?: string;
  is_published?: boolean;
}

export class UpdateProcessogramUseCase extends CreateProcessogramUseCase {
  async executeUpdate(
    params: UpdateProcessogramParams
  ): Promise<IProcessogram | null> {
    const {
      id,
      specie_id,
      production_module_id,
      name,
      description,
      is_published,
    } = params;

    try {
      const existingProcessogram = await ProcessogramModel.findById(id);

      if (!existingProcessogram) {
        throw new Error("Processogram not found");
      }

      const updateData: Partial<IProcessogram> = {};

      if (specie_id) updateData.specie_id = specie_id;
      if (production_module_id)
        updateData.production_module_id =
          production_module_id as mongoose.Types.ObjectId;

      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (is_published !== undefined) updateData.is_published = is_published;

      const updatedProcessogram = await ProcessogramModel.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      );

      if (is_published !== existingProcessogram.is_published) {
        const clientBaseUrl = process.env.CLIENT_DOMAIN;

        const specie = await SpecieModel.findById(specie_id);

        if (specie) {
          const pathname = specie.pathname;

          const revalidateUrl = `${clientBaseUrl}/api/revalidate?specie=${pathname}&secret=${process.env.REVALIDATION_SECRET}`;

          await axios.get(revalidateUrl);
        }
      }

      return updatedProcessogram;
    } catch (error: any) {
      console.error("Error updating processogram:", error);
      throw new Error(error.message || "Failed to update processogram");
    }
  }

  /***
   * Replace the SVG light and Dark URL and metadata
   * @param file_light - The light mode SVG file
   * @param file_dark - The dark mode SVG file
   * @param processogramId - The ID of the processogram to update
   * @returns Promise<void>
   * @throws Error if the file is not a valid SVG or if the processogram is not found
   */

  async replaceSvgFiles(
    file_light: File | null | undefined,
    file_dark: File | null | undefined,
    processogramId: string
  ): Promise<void> {
    if (file_light) {
      this.validateFile(file_light);
    }
    if (file_dark) {
      this.validateFile(file_dark);
    }

    const svgContentLight = file_light
      ? file_light.buffer.toString("utf-8")
      : "";
    const optimizedSvgContentLight = file_light
      ? this.optimizeSvg(svgContentLight, file_light.originalname)
      : "";

    const svgContentDark = file_dark ? file_dark.buffer.toString("utf-8") : "";
    const optimizedSvgContentDark = file_dark
      ? this.optimizeSvg(svgContentDark, file_dark.originalname)
      : optimizedSvgContentLight;

    await this.svgElementService.updateElementSvgMetadata({
      _id: processogramId,
      fileNameLight: file_light?.originalname ?? "",
      fileNameDark: file_dark?.originalname ?? "",
      svgLightString: optimizedSvgContentLight,
      svgDarkString: optimizedSvgContentDark,
      originalSizeDark: file_dark?.size,
      originalSizeLight: file_light?.size,
    });
  }
}
