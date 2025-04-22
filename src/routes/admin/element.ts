import express from "express";
import multer from "multer";

import { AuthProtected } from "@/middlewares/logged";
import ListElementController from "@/src/useCases/ElementUseCase/ListElementUseCase/ListElementController";
import { validate } from "@/src/utils/validate";
import { uploadSvgValidator } from "@/src/useCases/ElementUseCase/CreateElementUseCase/Validator";
import UploadSvgController from "@/useCases/ElementUseCase/CreateElementUseCase/CreateElementController";

const router = express.Router();

const upload = multer();

router.all("/*", AuthProtected);

// Create element route
router.post(
  "",
  upload.single("file"),
  uploadSvgValidator(),
  validate,
  UploadSvgController.upload
);

// List elements route
router.get("/", ListElementController.list);

// Get element by ID
router.get("/:id", ListElementController.getById);

export default router;
