import { Request, Response } from "express";
import { GetProcessogramUseCase } from "./GetPublicProcessogramUseCase";
import { query } from "express-validator";

export const getPublicProcessogramValidator = () => [
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
];

type RequestParams = {
  specie: string;
  productionModule: string;
};

class GetProcessogramController {
  async list(req: Request<any, any, any, RequestParams>, res: Response) {
    try {
      const { specie, productionModule } = req.query;

      if (!specie || typeof specie !== "string") {
        return res.status(400).json({ error: "Specie parameter is required" });
      }

      const getProcessogramsUseCase = new GetProcessogramUseCase();
      const elements = await getProcessogramsUseCase.execute({
        specie,
        productionModule,
      });

      return res.status(200).json(elements);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch elements" });
    }
  }
}

export const getPublicProcessogramController = new GetProcessogramController();
