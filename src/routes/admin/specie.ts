import express from "express";

import { AuthProtected } from "@/middlewares/logged";
import CreateSpecieController from "@/src/useCases/SpecieUseCase/CreateSpecieUseCase/CreateSpecieController";
import { createSpecieValidator } from "@/src/useCases/SpecieUseCase/CreateSpecieUseCase/Validator";
import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";
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

export default router;
