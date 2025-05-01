import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { listProcessogramDataController } from "@/src/useCases/ProcessogramDataUseCase/ListProcessogramDataUseCase/ListProcessogramDataController";

const router = express.Router();

router.all("/*", AuthProtected);

router.get("/", listProcessogramDataController.list);

router.get("/:id", listProcessogramDataController.getById);

router.get(
  "/processograms/:processogram_id",
  listProcessogramDataController.getByProcessogramId
);

export default router;
