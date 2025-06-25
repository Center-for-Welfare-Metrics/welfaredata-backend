import axios from "axios";

import { Request, Response } from "express";
import { CreateProcessogramUseCase } from "./CreateProcessogramUseCase";
import { ProcessogramModel } from "@/src/models/Processogram";

type WorkerReqBody = {
  specie_id: string;
  path: string;
  rootElementId: string;
  base64file: string; // base64 encoded string of the SVG file
  fileOriginalName: string;
};

export const execSvgUpload = async (
  req: Request<{}, {}, WorkerReqBody>,
  res: Response
) => {
  const { specie_id, rootElementId, path, base64file, fileOriginalName } =
    req.body;

  const fileBuffer = Buffer.from(base64file, "base64");

  const file = {
    originalname: fileOriginalName,
    mimetype: "image/svg+xml",
    buffer: fileBuffer,
    size: fileBuffer.length,
  };

  if (!file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uploadSvgUseCase = new CreateProcessogramUseCase();

  try {
    await uploadSvgUseCase.execute(file, {
      specie_id: specie_id,
      _id: rootElementId,
    });

    const clientBaseUrl = process.env.CLIENT_DOMAIN;

    const revalidateUrl = `${clientBaseUrl}/api/revalidate?specie=${path}&secret=${process.env.REVALIDATION_SECRET}`;

    await axios.get(revalidateUrl);
    const updated = await ProcessogramModel.findByIdAndUpdate(
      rootElementId,
      {
        status: "ready",
      },
      { new: true }
    );
    console.log(updated?._id, updated?.status);
    console.log("SVG uploaded successfully");
  } catch (error) {
    const updated = await ProcessogramModel.findByIdAndUpdate(
      rootElementId,
      {
        status: "error",
      },
      { new: true }
    );
    console.log(updated?._id, updated?.status);
    console.log("Error uploading SVG:", error);
  }

  return res.status(200).json(true);
};

type ReqBody = {
  specie_id: string;
  production_module_id: string;
  name: string;
  path: string;
  theme: "light" | "dark";
  is_published?: string;
};

class UploadSvgController {
  async upload(req: Request<{}, {}, ReqBody>, res: Response) {
    try {
      const {
        path,
        specie_id,
        name,
        production_module_id,
        theme,
        is_published,
      } = req.body;

      const file = req.file;

      const reqHeaders = req.headers;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadSvgUseCase = new CreateProcessogramUseCase();

      const rootElementId = await uploadSvgUseCase.initializeRootElement({
        name: name,
        specie_id,
        production_module_id,
        fileSize: file.size,
        theme,
        is_published: is_published === "true",
      });

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const WORKER_API_URL = process.env.WORKER_API_URL;

      axios
        .post(
          `${WORKER_API_URL}/admin/processograms/worker`,
          {
            specie_id,
            rootElementId,
            path,
            base64file: file.buffer.toString("base64"),
            fileOriginalName: file.originalname,
          },
          {
            headers: {
              cookie: reqHeaders.cookie || "",
              accept: reqHeaders.accept || "application/json",
            },
          }
        )
        .catch((error) => {
          console.error("Error sending file to worker:", error);
          throw new Error("Failed to send file to worker");
        });

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
