import { Request, Response } from "express";
import { GetProcessogramUseCase } from "./GetPublicProcessogramUseCase";
import { query } from "express-validator";

export const getPublicProcessogramValidator = () => [
  query("specie")
    .notEmpty()
    .withMessage("Specie is required")
    .isString()
    .withMessage("Specie must be a string"),
];

class GetProcessogramController {
  async list(req: Request, res: Response) {
    try {
      const { specie } = req.query;

      if (!specie || typeof specie !== "string") {
        return res.status(400).json({ error: "Specie parameter is required" });
      }

      const getElementUseCase = new GetProcessogramUseCase();
      const elements = await getElementUseCase.execute({ specie });

      return res.status(200).json(elements);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch elements" });
    }
  }
}

export const getPublicProcessogramController = new GetProcessogramController();
