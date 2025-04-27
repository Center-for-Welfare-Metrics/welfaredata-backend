import { Request, Response } from "express";
import { ListSvgDataUseCase } from "./ListSvgDataUseCase";

type ListReqQuery = {
  specie: string;
};

type BySvgElementReqParams = {
  element_id: string;
};

class ListSvgDataController {
  async list(
    req: Request<any, any, any, ListReqQuery>,
    res: Response
  ): Promise<Response> {
    try {
      const { specie } = req.query;

      if (!specie) {
        return res.status(400).json({ message: "Specie ID is required" });
      }

      const listSvgDataUseCase = new ListSvgDataUseCase();

      const data = await listSvgDataUseCase.execute(specie as string);

      return res.json(data);
    } catch (error: any) {
      console.error("Error in ListSvgDataController.list:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const listSvgDataUseCase = new ListSvgDataUseCase();
      const data = await listSvgDataUseCase.getById(id);

      if (!data) {
        return res.status(404).json({ message: "SVG Data not found" });
      }

      return res.json(data);
    } catch (error: any) {
      console.error("Error in ListSvgDataController.getById:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }

  async getBySvgElementId(
    req: Request<BySvgElementReqParams>,
    res: Response
  ): Promise<Response> {
    try {
      const { element_id } = req.params;

      if (!element_id) {
        return res.status(400).json({ message: "SVG Element ID is required" });
      }

      const listSvgDataUseCase = new ListSvgDataUseCase();
      const data = await listSvgDataUseCase.getBySvgElementId(element_id);

      return res.json(data);
    } catch (error: any) {
      console.error("Error in ListSvgDataController.getBySvgElementId:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }
}

export default new ListSvgDataController();
