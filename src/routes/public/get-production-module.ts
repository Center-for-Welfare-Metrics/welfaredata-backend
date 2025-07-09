import { getPublicProductionModuleController } from "@/src/useCases/ProductionModuleUseCase/GetPublicProductionModuleUseCase/GetPublicProductionModuleController";
import { Router } from "express";

const router = Router();

router.get("/:pathname", getPublicProductionModuleController.handle);

export default router;
