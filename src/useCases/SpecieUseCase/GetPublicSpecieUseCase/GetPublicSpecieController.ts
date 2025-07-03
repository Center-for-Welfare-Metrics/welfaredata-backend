import { Request, Response } from "express";
import { GetPublicSpecieUseCase } from "./GetPublicSpecieUseCase";

class GetPublicSpecieController {
  async handle(req: Request, res: Response) {
    try {
      const { pathname } = req.params;
      const useCase = new GetPublicSpecieUseCase();
      const specie = await useCase.execute({ pathname });
      res.json(specie);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const getPublicSpecieController = new GetPublicSpecieController();
