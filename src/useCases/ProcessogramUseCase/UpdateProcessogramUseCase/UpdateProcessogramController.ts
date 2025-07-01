import { Request, Response } from "express";
import { UpdateProcessogramUseCase } from "./UpdateProcessogramUseCase";
import { getLightAndDarkFiles } from "../utils";

type RequestParams = {
  id: string;
};

type RequestBody = {
  specie_id?: string;
  production_module_id?: string;
  name?: string;
  description?: string;
  is_published?: boolean;
};

class UpdateProcessogramController {
  async update(req: Request<RequestParams, {}, RequestBody>, res: Response) {
    try {
      const { id } = req.params;
      const {
        specie_id,
        production_module_id,
        name,
        description,
        is_published,
      } = req.body;

      const { file_dark, file_light } = getLightAndDarkFiles(req);

      const doNotHasBodyValues =
        !specie_id &&
        !production_module_id &&
        !name &&
        description === undefined &&
        is_published === undefined;

      const doNotHasFiles = !file_dark && !file_light;

      if (doNotHasBodyValues && doNotHasFiles) {
        return res.status(400).json({
          error:
            "At least one field (specie_id, production_module_id, theme, name, or description) must be provided for update",
        });
      }

      const updateProcessogramUseCase = new UpdateProcessogramUseCase();

      let result = null;

      if (!doNotHasBodyValues) {
        result = await updateProcessogramUseCase.executeUpdate({
          id,
          specie_id,
          production_module_id,
          name,
          description,
          is_published,
        });
      }

      if (!doNotHasFiles) {
        await updateProcessogramUseCase.replaceSvgFiles(
          file_light,
          file_dark,
          id
        );
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in UpdateProcessogramController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: error.message || "Failed to update processogram" });
      }
    }
  }
}

export default new UpdateProcessogramController();
