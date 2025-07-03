import { getPublicProductionModuleController } from "@/src/useCases/ProductionModuleUseCase/GetPublicProductionModuleUseCase/GetPublicProductionModuleController";
import { Router } from "express";

const router = Router();

router.get(
  "/production-modules/:id",
  getPublicProductionModuleController.handle
);

export default router;
