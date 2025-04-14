import express from "express";

const router = express.Router();

import GetElementController, {
  getElementValidator,
} from "@/useCases/GetElementUseCase/GetElementController";
import { validate } from "@/src/utils/validate";

router.get("/", getElementValidator(), validate, GetElementController.list);

export default router;
