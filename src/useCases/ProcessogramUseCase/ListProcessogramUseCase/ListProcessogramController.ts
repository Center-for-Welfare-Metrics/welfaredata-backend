import { Request, Response } from "express";
import { ListProcessogramUseCase } from "./ListProcessogramUseCase";
import { query } from "express-validator";

export const listProcessogramValidator = () => [
  query("specie_id")
    .optional()
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId"),
  query("production_module_id")
    .optional()
    .isMongoId()
    .withMessage("Production Module ID must be a valid MongoDB ObjectId"),
];

type ReqQuery = {
  specie_id?: string;
  production_module_id?: string;
};

class ListProcessogramController {
  async list(req: Request<any, any, any, ReqQuery>, res: Response) {
    try {
      const { specie_id, production_module_id } = req.query;

      const listProcessogramUseCase = new ListProcessogramUseCase();
      const elements = await listProcessogramUseCase.execute({
        specie_id,
        production_module_id,
      });

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

      const listProcessogramUseCase = new ListProcessogramUseCase();
      const element = await listProcessogramUseCase.getById(id);

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

      const listProcessogramUseCase = new ListProcessogramUseCase();
      const elements = await listProcessogramUseCase.getByRootId(rootId);

      return res.status(200).json(elements);
    } catch (error: any) {
      console.error("Error in ListElementController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch elements by root ID",
      });
    }
  }
}

export const listProcessogramController = new ListProcessogramController();
