import { Request, Response } from "express";
import { UpdateSpecieUseCase } from "./UpdateSpecieUseCase";

type RequestParams = {
  id: string;
};

type RequestBody = {
  name?: string;
  pathname?: string;
  description?: string;
};

class UpdateSpecieController {
  async update(req: Request<RequestParams, {}, RequestBody>, res: Response) {
    try {
      const { id } = req.params;
      const { name, pathname, description } = req.body;

      if (!name && !pathname && description === undefined) {
        return res.status(400).json({
          error:
            "At least one field (name, pathname, or description) must be provided for update",
        });
      }

      const updateSpecieUseCase = new UpdateSpecieUseCase();

      const result = await updateSpecieUseCase.execute({
        id,
        name,
        pathname,
        description,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in UpdateSpecieController:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      } else if (error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: error.message || "Failed to update species" });
      }
    }
  }
}

export default new UpdateSpecieController();
