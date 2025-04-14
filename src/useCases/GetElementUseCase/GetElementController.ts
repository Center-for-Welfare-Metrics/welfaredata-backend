import { Request, Response } from "express";
import { GetElementUseCase } from "./GetElementUseCase";
import { query } from "express-validator";

export const getElementValidator = () => [
  query("specie")
    .notEmpty()
    .withMessage("Specie is required")
    .isString()
    .withMessage("Specie must be a string"),
];

class GetElementController {
  async list(req: Request, res: Response) {
    try {
      const { specie } = req.query;

      if (!specie || typeof specie !== "string") {
        return res.status(400).json({ error: "Specie parameter is required" });
      }

      const getElementUseCase = new GetElementUseCase();
      const elements = await getElementUseCase.execute({ specie });

      return res.status(200).json(elements);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch elements" });
    }
  }
}

export default new GetElementController();
