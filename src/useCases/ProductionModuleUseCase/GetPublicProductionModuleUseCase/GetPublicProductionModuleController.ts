import { Request, Response } from "express";
import { GetPublicProductionModuleUseCase } from "./GetPublicProductionModuleUseCase";

type RequestParams = {
  pathname: string;
};

class GetPublicProductionModuleController {
  async handle(req: Request<RequestParams>, res: Response) {
    try {
      const { pathname } = req.params;
      const useCase = new GetPublicProductionModuleUseCase();
      const productionModule = await useCase.execute({ pathname });
      res.json(productionModule);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const getPublicProductionModuleController =
  new GetPublicProductionModuleController();
