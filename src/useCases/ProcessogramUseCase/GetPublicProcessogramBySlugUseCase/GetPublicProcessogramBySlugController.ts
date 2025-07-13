import { Request, Response } from "express";
import { GetProcessogramBySlugUseCase } from "./GetPublicProcessogramBySlugUseCase";
import { query } from "express-validator";

export const getPublicProcessogramBySlugValidator = () => [
  query("specie")
    .notEmpty()
    .withMessage("Specie is required")
    .isString()
    .withMessage("Specie must be a string"),
  query("productionModule")
    .notEmpty()
    .withMessage("Production module is required")
    .isString()
    .withMessage("Production module must be a string"),
  query("processogram")
    .notEmpty()
    .withMessage("Processogram is required")
    .isString()
    .withMessage("Processogram must be a string"),
];

type RequestParams = {
  specie: string;
  productionModule: string;
  processogram: string;
};

class GetProcessogramBySlugController {
  async get(req: Request<any, any, any, RequestParams>, res: Response) {
    try {
      const { specie, productionModule, processogram } = req.query;

      const getProcessogramBySlugUseCase = new GetProcessogramBySlugUseCase();
      const processogramWithDatas = await getProcessogramBySlugUseCase.execute({
        specie,
        productionModule,
        processogram,
      });

      if (!processogramWithDatas) {
        return res.status(404).json({ error: "Processogram not found" });
      }

      return res.status(200).json(processogramWithDatas);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch processogram" });
    }
  }
}

export const getPublicProcessogramBySlugController =
  new GetProcessogramBySlugController();
