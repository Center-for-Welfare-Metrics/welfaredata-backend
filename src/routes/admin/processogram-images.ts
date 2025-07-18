import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/ListProcessogramImagesUseCase/ListProcessogramImagesController";
import { updateProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/UpdateProcessogramImagesUseCase/UpdateProcessogramImagesController";
import {
  updateProcessogramImagesValidator,
  removeImageValidator,
  updateBulkImagesValidator,
} from "@/src/useCases/ProcessogramImagesUseCase/UpdateProcessogramImagesUseCase/Validator";
import { validate } from "@/src/utils/validate";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.all("/*", AuthProtected);

// List all processogram images by specie pathname
router.get("/", listProcessogramImagesController.list);

// Get processogram images by ID
router.get("/:id", listProcessogramImagesController.getById);

// Get processogram images by processogram ID
router.get(
  "/processograms/:processogram_id",
  listProcessogramImagesController.getByProcessogramId
);

// Update single image by ID and key
router.patch(
  "/:id",
  upload.single("file"),
  updateProcessogramImagesValidator(),
  validate,
  updateProcessogramImagesController.update
);

router.patch(
  "/:id/auto-search",
  updateProcessogramImagesController.updateAutoSearch
);

// Remove single image by ID and key
router.patch(
  "/:id/remove",
  removeImageValidator(),
  validate,
  updateProcessogramImagesController.delete
);

export default router;
