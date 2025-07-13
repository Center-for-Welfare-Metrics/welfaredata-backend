import express from "express";
import { listProcessogramDataController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramDataUseCase/ListProcessogramDataController";
import { listProcessogramQuestionController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramQuestionUseCase/ListProcessogramQuestionController";
import {
  getPublicProcessogramValidator,
  getPublicProcessogramController,
} from "@/src/useCases/ProcessogramUseCase/GetPublicProcessogramUseCase/GetPublicProcessogramController";
import { validate } from "@/src/utils/validate";
import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";
import {
  getPublicProcessogramBySlugController,
  getPublicProcessogramBySlugValidator,
} from "@/src/useCases/ProcessogramUseCase/GetPublicProcessogramBySlugUseCase/GetPublicProcessogramBySlugController";

const router = express.Router();

router.get(
  "/",
  getPublicProcessogramValidator(),
  validate,
  getPublicProcessogramController.list
);

router.get(
  "/data",
  getPublicProcessogramValidator(),
  validate,
  listProcessogramDataController.list
);

router.get(
  "/questions",
  getPublicProcessogramValidator(),
  validate,
  listProcessogramQuestionController.list
);

router.get(
  "/by-slug",
  getPublicProcessogramBySlugValidator(),
  validate,
  getPublicProcessogramBySlugController.get
);

router.get("/species/pathname/:pathname", ListSpecieController.getByPathname);

export default router;
