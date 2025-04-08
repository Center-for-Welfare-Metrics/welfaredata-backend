import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

import UploadSvgController from "@/useCases/UploadSvgUseCase/UploadSvgController";
import { uploadSvgValidator } from "@/useCases/UploadSvgUseCase/Validator";
import { validate } from "src/utils/validate";

router.post(
  "",
  upload.single("file"),
  uploadSvgValidator(),
  validate,
  UploadSvgController.upload
);

export default router;
