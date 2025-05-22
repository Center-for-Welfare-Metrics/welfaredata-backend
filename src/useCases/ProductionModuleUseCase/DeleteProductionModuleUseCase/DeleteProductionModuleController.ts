import { Request, Response } from "express";
import { DeleteProductionModuleUseCase } from "./DeleteProductionModuleUseCase";

type RequestParams = {
  id: string;
};

class DeleteProductionModuleController {
  async delete(req: Request<RequestParams>, res: Response) {
    try {
      const { id } = req.params;

      const deleteProductionModuleUseCase = new DeleteProductionModuleUseCase();

      const result = await deleteProductionModuleUseCase.execute({ id });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in DeleteProductionModuleController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({
            error: error.message || "Failed to delete production module",
          });
      }
    }
  }
}

export default new DeleteProductionModuleController();
