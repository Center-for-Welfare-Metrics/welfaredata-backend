import { Request, Response } from "express";
import { ListElementUseCase } from "./ListElementUseCase";
import { param, query } from "express-validator";

export const listElementValidator = () => [
  query("specie_id")
    .notEmpty()
    .withMessage("Specie ID is required")
    .isString()
    .withMessage("Specie ID must be a string"),
];

class ListElementController {
  async list(req: Request, res: Response) {
    try {
      const { specie_id } = req.query;

      if (!specie_id || typeof specie_id !== "string") {
        return res
          .status(400)
          .json({ error: "Specie ID parameter is required" });
      }

      const listElementUseCase = new ListElementUseCase();
      const elements = await listElementUseCase.execute(specie_id);

      return res.status(200).json(elements);
    } catch (error: any) {
      console.error("Error in ListElementController:", error);
      return res.status(500).json({
        error: error.message || "Failed to list elements",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const listElementUseCase = new ListElementUseCase();
      const element = await listElementUseCase.getById(id);

      if (!element) {
        return res.status(404).json({ error: "Element not found" });
      }

      return res.status(200).json(element);
    } catch (error: any) {
      console.error("Error in ListElementController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch element by ID",
      });
    }
  }

  async getByRootId(req: Request, res: Response) {
    try {
      const { rootId } = req.params;

      const listElementUseCase = new ListElementUseCase();
      const elements = await listElementUseCase.getByRootId(rootId);

      return res.status(200).json(elements);
    } catch (error: any) {
      console.error("Error in ListElementController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch elements by root ID",
      });
    }
  }
}

export default new ListElementController();
