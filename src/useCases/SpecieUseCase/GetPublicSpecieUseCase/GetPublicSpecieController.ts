import { Request, Response } from "express";
import { GetPublicSpecieUseCase } from "./GetPublicSpecieUseCase";

class GetPublicSpecieController {
  async handle(req: Request, res: Response) {
    try {
      const useCase = new GetPublicSpecieUseCase();
      const species = await useCase.execute();
      res.json(species);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const getPublicSpecieController = new GetPublicSpecieController();
