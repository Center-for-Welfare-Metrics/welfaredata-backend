import express from "express";
import ListSvgDataController from "@/src/useCases/SvgDataUseCase/ListSvgDataUseCase/ListSvgDataController";

const router = express.Router();

import GetElementController, {
  getElementValidator,
} from "@/useCases/GetElementUseCase/GetElementController";
import { validate } from "@/src/utils/validate";

router.get("/", getElementValidator(), validate, GetElementController.list);

router.get(
  "/data",
  getElementValidator(),
  validate,
  ListSvgDataController.list
);

export default router;
