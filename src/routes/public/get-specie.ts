import { getPublicSpecieController } from "@/src/useCases/SpecieUseCase/GetPublicSpecieUseCase/GetPublicSpecieController";
import { Router } from "express";

const router = Router();

router.get("/species/:pathname", getPublicSpecieController.handle);

export default router;
