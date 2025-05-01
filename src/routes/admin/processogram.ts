import express from "express";
import multer from "multer";

import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramController } from "@/src/useCases/ProcessogramUseCase/ListProcessogramUseCase/ListProcessogramController";
import { validate } from "@/src/utils/validate";
import { uploadSvgValidator } from "@/src/useCases/ProcessogramUseCase/CreateProcessogramUseCase/Validator";
import UploadSvgController from "@/src/useCases/ProcessogramUseCase/CreateProcessogramUseCase/CreateProcessogramController";

const router = express.Router();

const upload = multer();

router.all("/*", AuthProtected);

router.post(
  "/",
  upload.single("file"),
  uploadSvgValidator(),
  validate,
  UploadSvgController.upload
);

router.get("/", listProcessogramController.list);

router.get("/:id", listProcessogramController.getById);

export default router;
