import { Request, Response } from "express";
import { DeleteSpecieUseCase } from "./DeleteSpecieUseCase";

type RequestParams = {
  id: string;
};

class DeleteSpecieController {
  async delete(req: Request<RequestParams>, res: Response) {
    try {
      const { id } = req.params;

      const deleteSpecieUseCase = new DeleteSpecieUseCase();

      const result = await deleteSpecieUseCase.execute({ id });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in DeleteSpecieController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: error.message || "Failed to delete species" });
      }
    }
  }
}

export default new DeleteSpecieController();
