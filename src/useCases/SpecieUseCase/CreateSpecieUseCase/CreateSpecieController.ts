import { Request, Response } from "express";
import { CreateSpecieUseCase } from "./CreateSpecieUseCase";

type RequestBody = {
  name: string;
  pathname: string;
};

class CreateSpecieController {
  async create(req: Request<{}, {}, RequestBody>, res: Response) {
    try {
      const { name, pathname } = req.body;

      const { auth_user } = req;

      const createSpecieUseCase = new CreateSpecieUseCase();

      const result = await createSpecieUseCase.execute({
        name,
        pathname,
        creator_id: auth_user?._id,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Error in CreateSpecieController:", error);
      return res
        .status(error.message.includes("already exists") ? 409 : 500)
        .json({ error: error.message || "Failed to create species" });
    }
  }
}

export default new CreateSpecieController();
