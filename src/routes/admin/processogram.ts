import express from "express";
import multer from "multer";

import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramController } from "@/src/useCases/ProcessogramUseCase/ListProcessogramUseCase/ListProcessogramController";
import { validate } from "@/src/utils/validate";
import { uploadSvgValidator } from "@/src/useCases/ProcessogramUseCase/CreateProcessogramUseCase/Validator";
import UploadSvgController, {
  execSvgUpload,
} from "@/src/useCases/ProcessogramUseCase/CreateProcessogramUseCase/CreateProcessogramController";
import UpdateProcessogramController from "@/src/useCases/ProcessogramUseCase/UpdateProcessogramUseCase/UpdateProcessogramController";
import { updateProcessogramValidator } from "@/src/useCases/ProcessogramUseCase/UpdateProcessogramUseCase/Validator";
import deleteProcessogramController from "@/src/useCases/ProcessogramUseCase/DeleteProcessogramUseCase/DeleteProcessogramController";
import { deleteProcessogramValidator } from "@/src/useCases/ProcessogramUseCase/DeleteProcessogramUseCase/Validator";

const router = express.Router();

const upload = multer();

router.all("/*", AuthProtected);

router.post(
  "/",
  upload.fields([
    { name: "file_light", maxCount: 1 },
    { name: "file_dark", maxCount: 1 },
  ]),
  uploadSvgValidator(),
  validate,
  UploadSvgController.upload
);

router.post(
  "/worker",
  upload.fields([
    { name: "file_light", maxCount: 1 },
    { name: "file_dark", maxCount: 1 },
  ]),
  execSvgUpload
);

router.get("/", listProcessogramController.list);

router.get("/:id", listProcessogramController.getById);

// Update processogram route
router.patch(
  "/:id",
  updateProcessogramValidator(),
  validate,
  UpdateProcessogramController.update
);

// Delete processogram route
router.delete(
  "/:id",
  deleteProcessogramValidator(),
  validate,
  deleteProcessogramController.delete
);

export default router;
