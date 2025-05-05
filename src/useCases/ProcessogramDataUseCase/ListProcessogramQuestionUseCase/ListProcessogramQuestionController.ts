import { Request, Response } from "express";
import { ListProcessogramQuestionUseCase } from "./ListProcessogramQuestionUseCase";

type ListReqQuery = {
  specie: string;
};

type ByProcessogramReqParams = {
  processogram_id: string;
};

class ListProcessogramQuestionController {
  async list(
    req: Request<any, any, any, ListReqQuery>,
    res: Response
  ): Promise<Response> {
    try {
      const { specie } = req.query;

      if (!specie) {
        return res.status(400).json({ message: "Specie ID is required" });
      }

      const listProcessogramQuestionUseCase =
        new ListProcessogramQuestionUseCase();

      const data = await listProcessogramQuestionUseCase.execute(
        specie as string
      );

      return res.json(data);
    } catch (error: any) {
      console.error("Error in ListProcessogramQuestionController.list:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const listProcessogramQuestionUseCase =
        new ListProcessogramQuestionUseCase();
      const data = await listProcessogramQuestionUseCase.getById(id);

      if (!data) {
        return res
          .status(404)
          .json({ message: "Processogram Question not found" });
      }

      return res.json(data);
    } catch (error: any) {
      console.error(
        "Error in ListProcessogramQuestionController.getById:",
        error
      );
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }

  async getByProcessogramId(
    req: Request<ByProcessogramReqParams>,
    res: Response
  ): Promise<Response> {
    try {
      const { processogram_id } = req.params;

      if (!processogram_id) {
        return res.status(400).json({ message: "Processogram ID is required" });
      }

      const listProcessogramQuestionUseCase =
        new ListProcessogramQuestionUseCase();
      const data = await listProcessogramQuestionUseCase.getByProcessogramId(
        processogram_id
      );

      return res.json(data);
    } catch (error: any) {
      console.error(
        "Error in ListProcessogramQuestionController.getByProcessogramId:",
        error
      );
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }
}

export const listProcessogramQuestionController =
  new ListProcessogramQuestionController();
