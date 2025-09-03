import { Request, Response } from "express";
import { GetProcessogramUseCase } from "./GetPublicProcessogramUseCase";
import { query } from "express-validator";

export const getPublicProcessogramValidator = () => [
  query("specie").optional().isString().withMessage("Specie must be a string"),
  query("productionModule")
    .optional()
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
