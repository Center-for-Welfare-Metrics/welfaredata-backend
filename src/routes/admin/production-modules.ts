import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { validate } from "@/src/utils/validate";
import { createProductionModuleController } from "@/src/useCases/ProductionModuleUseCase/CreateProductionModuleUseCase/CreateProductionModuleController";
import { createProductionModuleValidator } from "@/src/useCases/ProductionModuleUseCase/CreateProductionModuleUseCase/Validator";
import {
  listProductionModuleController,
  listProductionModuleValidator,
} from "@/src/useCases/ProductionModuleUseCase/ListProductionModuleUseCase/ListProductionModuleController";

const router = express.Router();

router.all("/*", AuthProtected);

// Create production module route
router.post(
  "/",
  createProductionModuleValidator(),
  validate,
  createProductionModuleController.create
);

// List production modules route
router.get(
  "/",
  listProductionModuleValidator(),
  validate,
  listProductionModuleController.list
);

// Get production module by ID
router.get("/:id", listProductionModuleController.getById);

export default router;
