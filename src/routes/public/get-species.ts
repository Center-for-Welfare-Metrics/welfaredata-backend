import express from "express";
import { getPublicSpecieController } from "@/src/useCases/SpecieUseCase/GetPublicSpecieUseCase/GetPublicSpecieController";

const router = express.Router();

import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";

router.get("/", getPublicSpecieController.handle);

router.get("/pathname/:pathname", ListSpecieController.getByPathname);

export default router;
