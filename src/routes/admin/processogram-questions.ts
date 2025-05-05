import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramQuestionController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramQuestionUseCase/ListProcessogramQuestionController";

const router = express.Router();

router.all("/*", AuthProtected);

router.get("/", listProcessogramQuestionController.list);

router.get("/:id", listProcessogramQuestionController.getById);

router.get(
  "/processograms/:processogram_id",
  listProcessogramQuestionController.getByProcessogramId
);

export default router;
