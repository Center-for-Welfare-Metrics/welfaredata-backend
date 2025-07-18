import express from "express";
import { listProcessogramImagesController } from "@/src/useCases/ProcessogramImagesUseCase/ListProcessogramImagesUseCase/ListProcessogramImagesController";

const router = express.Router();

router.get(
  "/processograms/:processogram_id",
  listProcessogramImagesController.getByProcessogramId
);

export default router;
