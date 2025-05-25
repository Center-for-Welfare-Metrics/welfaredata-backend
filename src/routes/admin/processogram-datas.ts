import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramDataController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramDataUseCase/ListProcessogramDataController";
import UpdateProcessogramDataController from "@/src/useCases/ProcessogramDataUseCase/UpdateProcessogramDataUseCase/UpdateProcessogramDataController";
import { updateProcessogramDataValidator } from "@/src/useCases/ProcessogramDataUseCase/UpdateProcessogramDataUseCase/Validator";
import { validate } from "@/src/utils/validate";

const router = express.Router();

router.all("/*", AuthProtected);

router.get("/", listProcessogramDataController.list);

router.get("/:id", listProcessogramDataController.getById);

router.get(
  "/processograms/:processogram_id",
  listProcessogramDataController.getByProcessogramId
);

// Update processogram data description by ID and key
router.patch(
  "/:id",
  updateProcessogramDataValidator(),
  validate,
  UpdateProcessogramDataController.update
);

export default router;
