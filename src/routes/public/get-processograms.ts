import express from "express";
import { listProcessogramDataController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramDataUseCase/ListProcessogramDataController";

const router = express.Router();

import {
  getPublicProcessogramValidator,
  getPublicProcessogramController,
} from "@/src/useCases/ProcessogramUseCase/GetPublicProcessogramUseCase/GetPublicProcessogramController";
import { validate } from "@/src/utils/validate";
import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";

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

router.get("/species/pathname/:pathname", ListSpecieController.getByPathname);

export default router;
