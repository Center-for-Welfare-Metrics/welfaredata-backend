import axios from "axios";

import { Request, Response } from "express";
import { UploadSvgUseCase } from "./CreateElmentUseCase";
import SvgElement from "@/src/models/SvgElement";

const execSvgUpload = async (
  file: Express.Multer.File,
  specie_id: string,
  path: string,
  _id: string
) => {
  const uploadSvgUseCase = new UploadSvgUseCase();

  await uploadSvgUseCase.execute(file, {
    specie_id: specie_id,
    _id,
  });

  const clientBaseUrl = process.env.CLIENT_DOMAIN;

  const revalidateUrl = `${clientBaseUrl}/api/revalidate?specie=${path}&secret=${process.env.REVALIDATION_SECRET}`;
  try {
    await axios.get(revalidateUrl);
    SvgElement.findByIdAndUpdate(
      _id,
      {
        status: "ready",
      },
      { new: true }
    );
    console.log("Revalidation successful");
  } catch (error) {
    SvgElement.findByIdAndUpdate(
      _id,
      {
        status: "error",
      },
      { new: true }
    );
    console.log("Error revalidating:", error);
  }
};

type ReqBody = {
  specie_id: string;
  name: string;
  path: string;
};

class UploadSvgController {
  async upload(req: Request<{}, {}, ReqBody>, res: Response) {
    try {
      const { path, specie_id, name } = req.body;

      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadSvgUseCase = new UploadSvgUseCase();

      const rootElementId = await uploadSvgUseCase.initializeRootElement({
        name: name,
        specie_id: specie_id,
      });

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      execSvgUpload(file, specie_id, path, rootElementId);

      return res.status(200).json(true);
    } catch (error: any) {
      console.log("Error uploading SVG:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to upload SVG" });
    }
  }
}

export default new UploadSvgController();
