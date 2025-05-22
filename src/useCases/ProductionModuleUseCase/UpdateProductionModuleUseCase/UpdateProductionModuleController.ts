import { Request, Response } from "express";
import { UpdateProductionModuleUseCase } from "./UpdateProductionModuleUseCase";

type RequestParams = {
  id: string;
};

type RequestBody = {
  name?: string;
  description?: string;
  specie_id?: string;
};

class UpdateProductionModuleController {
  async update(req: Request<RequestParams, {}, RequestBody>, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, specie_id } = req.body;

      if (!name && description === undefined && !specie_id) {
        return res.status(400).json({
          error:
            "At least one field (name, description, or specie_id) must be provided for update",
        });
      }

      const updateProductionModuleUseCase = new UpdateProductionModuleUseCase();

      const result = await updateProductionModuleUseCase.execute({
        id,
        name,
        description,
        specie_id,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in UpdateProductionModuleController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({
          error: error.message || "Failed to update production module",
        });
      }
    }
  }
}

export const updateProductionModuleController =
  new UpdateProductionModuleController();
