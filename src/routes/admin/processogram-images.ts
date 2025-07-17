import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/ListProcessogramImagesUseCase/ListProcessogramImagesController";
import { updateProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/UpdateProcessogramImagesUseCase/UpdateProcessogramImagesController";
import { createProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/CreateProcessogramImagesUseCase/CreateProcessogramImagesController";
import { deleteProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/DeleteProcessogramImagesUseCase/DeleteProcessogramImagesController";
import {
  updateProcessogramImagesValidator,
  removeImageValidator,
  updateBulkImagesValidator,
} from "@/src/useCases/ProcessogramImagesUseCase/UpdateProcessogramImagesUseCase/Validator";
import { createProcessogramImagesValidator } from "@/src/useCases/ProcessogramImagesUseCase/CreateProcessogramImagesUseCase/Validator";
import { deleteMultipleValidator } from "@/src/useCases/ProcessogramImagesUseCase/DeleteProcessogramImagesUseCase/Validator";
import { validate } from "@/src/utils/validate";

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

// Create new processogram images
router.post(
  "/",
  createProcessogramImagesValidator(),
  validate,
  createProcessogramImagesController.create
);

// Update single image by ID and key
router.patch(
  "/:id",
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

// Delete processogram images by ID
router.delete("/:id", deleteProcessogramImagesController.delete);

// Delete processogram images by processogram ID
router.delete(
  "/processograms/:processogram_id",
  deleteProcessogramImagesController.deleteByProcessogramId
);

// Delete multiple processogram images
router.delete(
  "/",
  deleteMultipleValidator(),
  validate,
  deleteProcessogramImagesController.deleteMultiple
);

export default router;
