import express from "express";
import ListSvgDataController from "@/src/useCases/SvgDataUseCase/ListSvgDataUseCase/ListSvgDataController";

const router = express.Router();

import GetElementController, {
  getElementValidator,
} from "@/useCases/GetElementUseCase/GetElementController";
import { validate } from "@/src/utils/validate";
import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";

router.get("/", getElementValidator(), validate, GetElementController.list);

router.get(
  "/data",
  getElementValidator(),
  validate,
  ListSvgDataController.list
);

router.get("/specie/pathname/:pathname", ListSpecieController.getByPathname);

export default router;
