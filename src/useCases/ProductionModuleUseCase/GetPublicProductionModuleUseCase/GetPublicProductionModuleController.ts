import { Request, Response } from "express";
import { GetPublicProductionModuleUseCase } from "./GetPublicProductionModuleUseCase";

class GetPublicProductionModuleController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const useCase = new GetPublicProductionModuleUseCase();
      const productionModule = await useCase.execute({ id });
      res.json(productionModule);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const getPublicProductionModuleController =
  new GetPublicProductionModuleController();
