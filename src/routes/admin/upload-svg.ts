import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

import UploadSvgController from "@/useCases/UploadSvgUseCase/UploadSvgController";

router.post("", upload.single("file"), UploadSvgController.upload);

export default router;
