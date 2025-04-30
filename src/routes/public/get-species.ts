import express from "express";

const router = express.Router();

import ListSpecieController from "@/src/useCases/SpecieUseCase/ListSpecieUseCase/ListSpecieController";

router.get("/pathname/:pathname", ListSpecieController.getByPathname);

export default router;
