import { Request, Response } from "express";
import { UploadSvgUseCase } from "./UploadSvgUseCase";

type ReqBody = {
  specie: string;
};

class UploadSvgController {
  async upload(req: Request<{}, {}, ReqBody>, res: Response) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadSvgUseCase = new UploadSvgUseCase();
      const result = await uploadSvgUseCase.execute(file, {
        specie: req.body.specie,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to upload SVG" });
    }
  }
}

export default new UploadSvgController();
