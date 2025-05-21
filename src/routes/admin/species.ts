import express from "express";

import { AuthProtected } from "@/middlewares/logged";
import CreateSpecieController from "@/src/useCases/SpecieUseCase/CreateSpecieUseCase/CreateSpecieController";
import { createSpecieValidator } from "@/src/useCases/SpecieUseCase/CreateSpecieUseCase/Validator";
import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";
import UpdateSpecieController from "@/src/useCases/SpecieUseCase/UpdateSpecieUseCase/UpdateSpecieController";
import { updateSpecieValidator } from "@/src/useCases/SpecieUseCase/UpdateSpecieUseCase/Validator";
import { validate } from "@/src/utils/validate";

const router = express.Router();

router.all("/*", AuthProtected);

// Create specie route
router.post(
  "/",
  createSpecieValidator(),
  validate,
  CreateSpecieController.create
);

// List species route
router.get("/", ListSpecieController.list);

// Get specie by ID
router.get("/:id", ListSpecieController.getById);

// Get specie by pathname
router.get("/pathname/:pathname", ListSpecieController.getByPathname);

// Update specie route
router.patch(
  "/:id",
  updateSpecieValidator(),
  validate,
  UpdateSpecieController.update
);

export default router;
