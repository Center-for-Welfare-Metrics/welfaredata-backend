import { Request, Response } from "express";
import { UpdateProcessogramDataUseCase } from "./UpdateProcessogramDataUseCase";

type RequestParams = {
  id: string;
};

type RequestBody = {
  key: string;
  description: string;
};

class UpdateProcessogramDataController {
  async update(req: Request<RequestParams, {}, RequestBody>, res: Response) {
    try {
      const { id } = req.params;
      const { key, description } = req.body;

      if (!key || description === undefined) {
        return res.status(400).json({
          error: "Both key and description are required for update",
        });
      }

      const updateProcessogramDataUseCase = new UpdateProcessogramDataUseCase();

      const result = await updateProcessogramDataUseCase.execute({
        id,
        key,
        description,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in UpdateProcessogramDataController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({
            error: error.message || "Failed to update processogram data",
          });
      }
    }
  }
}

export default new UpdateProcessogramDataController();
