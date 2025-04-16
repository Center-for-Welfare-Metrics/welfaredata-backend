import { Request, Response } from "express";
import { ListSpecieUseCase } from "./ListSpecieUseCase";
import { query } from "express-validator";

class ListSpecieController {
  async list(req: Request, res: Response) {
    try {
      const listSpecieUseCase = new ListSpecieUseCase();
      const result = await listSpecieUseCase.execute();

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in ListSpecieController:", error);
      return res.status(500).json({
        error: error.message || "Failed to list species",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const listSpecieUseCase = new ListSpecieUseCase();
      const specie = await listSpecieUseCase.getById(id);

      if (!specie) {
        return res.status(404).json({ error: "Species not found" });
      }

      return res.status(200).json(specie);
    } catch (error: any) {
      console.error("Error in ListSpecieController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch species by ID",
      });
    }
  }

  async getByPathname(req: Request, res: Response) {
    try {
      const { pathname } = req.params;

      const listSpecieUseCase = new ListSpecieUseCase();
      const specie = await listSpecieUseCase.getByPathname(pathname);

      if (!specie) {
        return res.status(404).json({ error: "Species not found" });
      }

      return res.status(200).json(specie);
    } catch (error: any) {
      console.error("Error in ListSpecieController:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch species by pathname",
      });
    }
  }
}

export default new ListSpecieController();
