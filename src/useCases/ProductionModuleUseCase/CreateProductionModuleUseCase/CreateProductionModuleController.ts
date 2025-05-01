import { Request, Response } from "express";
import { CreateProductionModuleUseCase } from "./CreateProductionModuleUseCase";

type RequestBody = {
  name: string;
  description?: string;
  specie_id: string;
};

class CreateProductionModuleController {
  async create(req: Request<{}, {}, RequestBody>, res: Response) {
    try {
      const { name, description, specie_id } = req.body;
      const { auth_user } = req;

      const createProductionModuleUseCase = new CreateProductionModuleUseCase();

      const result = await createProductionModuleUseCase.execute({
        name,
        description,
        specie_id,
        creator_id: auth_user?._id,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Error in CreateProductionModuleController:", error);
      return res
        .status(error.message.includes("not found") ? 404 : 500)
        .json({ error: error.message || "Failed to create production module" });
    }
  }
}

export const createProductionModuleController =
  new CreateProductionModuleController();
