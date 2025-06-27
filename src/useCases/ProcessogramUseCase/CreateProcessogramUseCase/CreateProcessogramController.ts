import axios from "axios";
import FormData from "form-data";

import { Request, Response } from "express";
import { CreateProcessogramUseCase } from "./CreateProcessogramUseCase";
import { ProcessogramModel } from "@/src/models/Processogram";

type WorkerReqBody = {
  specie_id: string;
  path: string;
  rootElementId: string;
};

export const execSvgUpload = async (
  req: Request<{}, {}, WorkerReqBody>,
  res: Response
) => {
  const { specie_id, rootElementId, path } = req.body;

  let file_light;
  if (
    req.files &&
    typeof req.files === "object" &&
    "file_light" in req.files &&
    Array.isArray(
      (req.files as { [fieldname: string]: Express.Multer.File[] })[
        "file_light"
      ]
    )
  ) {
    file_light = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "file_light"
    ][0];
  }

  let file_dark;
  if (
    req.files &&
    typeof req.files === "object" &&
    "file_dark" in req.files &&
    Array.isArray(
      (req.files as { [fieldname: string]: Express.Multer.File[] })["file_dark"]
    )
  ) {
    file_dark = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "file_dark"
    ][0];
  }

  if (!file_light && !file_dark) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uploadSvgUseCase = new CreateProcessogramUseCase();

  try {
    await uploadSvgUseCase.execute(file_light, file_dark, {
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

      let file_light;
      if (
        req.files &&
        typeof req.files === "object" &&
        "file_light" in req.files &&
        Array.isArray(
          (req.files as { [fieldname: string]: Express.Multer.File[] })[
            "file_light"
          ]
        )
      ) {
        file_light = (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        )["file_light"][0];
      }

      let file_dark;
      if (
        req.files &&
        typeof req.files === "object" &&
        "file_dark" in req.files &&
        Array.isArray(
          (req.files as { [fieldname: string]: Express.Multer.File[] })[
            "file_dark"
          ]
        )
      ) {
        file_dark = (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        )["file_dark"][0];
      }

      if (!file_light && !file_dark) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const reqHeaders = req.headers;

      if (!file_light && !file_dark) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadSvgUseCase = new CreateProcessogramUseCase();

      const file = (file_light || file_dark) as any as File;

      const rootElementId = await uploadSvgUseCase.initializeRootElement({
        name: name,
        specie_id,
        production_module_id,
        fileSize: file.size,
        theme,
        is_published: is_published === "true",
      });

      const WORKER_API_URL = process.env.WORKER_API_URL;

      const formData = new FormData();
      formData.append("specie_id", specie_id);
      formData.append("rootElementId", rootElementId);
      formData.append("path", path);
      if (file_light) {
        formData.append("file_light", file_light.buffer, {
          filename: file_light.originalname,
          contentType: file_light.mimetype,
        });
      }
      if (file_dark) {
        formData.append("file_dark", file_dark.buffer, {
          filename: file_dark.originalname,
          contentType: file_dark.mimetype,
        });
      }

      axios
        .post(`${WORKER_API_URL}/admin/processograms/worker`, formData, {
          headers: {
            ...formData.getHeaders(),
            cookie: reqHeaders.cookie || "",
            accept: reqHeaders.accept || "application/json",
          },
        })
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
