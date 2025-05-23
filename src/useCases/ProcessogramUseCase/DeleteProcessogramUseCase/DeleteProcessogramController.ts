import { Request, Response } from "express";
import { DeleteProcessogramUseCase } from "./DeleteProcessogramUseCase";

type RequestParams = {
  id: string;
};

class DeleteProcessogramController {
  async delete(req: Request<RequestParams>, res: Response) {
    try {
      const { id } = req.params;

      const deleteProcessogramUseCase = new DeleteProcessogramUseCase();

      const result = await deleteProcessogramUseCase.execute({ id });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in DeleteProcessogramController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({
          error: error.message || "Failed to delete processogram",
        });
      }
    }
  }
}

export default new DeleteProcessogramController();
