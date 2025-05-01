import { Request, Response } from "express";
import { ListProductionModuleUseCase } from "./ListProductionModuleUseCase";
import { query } from "express-validator";

export const listProductionModuleValidator = () => [
  query("specie_id")
    .notEmpty()
    .withMessage("Specie ID is required")
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId"),
];

class ListProductionModuleController {
  async list(req: Request, res: Response) {
    try {
      const { specie_id } = req.query;

      if (!specie_id || typeof specie_id !== "string") {
        return res
          .status(400)
          .json({ error: "Specie ID parameter is required" });
      }

      const listProductionModuleUseCase = new ListProductionModuleUseCase();
      const productionModules = await listProductionModuleUseCase.execute(
        specie_id
      );

      return res.status(200).json(productionModules);
    } catch (error: any) {
      console.error("Error in ListProductionModuleController:", error);
      return res.status(500).json({
        error: error.message || "Failed to list production modules",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const listProductionModuleUseCase = new ListProductionModuleUseCase();
      const productionModule = await listProductionModuleUseCase.getById(id);

      if (!productionModule) {
        return res.status(404).json({ error: "Production module not found" });
      }

      return res.status(200).json(productionModule);
    } catch (error: any) {
      console.error("Error in ListProductionModuleController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch production module by ID",
      });
    }
  }
}

export const listProductionModuleController =
  new ListProductionModuleController();
