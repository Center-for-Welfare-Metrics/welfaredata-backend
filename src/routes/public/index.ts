import express from "express";
const router = express.Router();

import getProcessograms from "./get-processograms";
import getSpecies from "./get-species";
import chat from "./chat";
import searchImages from "./search-images";
import productionModules from "./get-production-module";
import processogramImages from "./get-processogram-images";

router.use("/processograms", getProcessograms);

router.use("/species", getSpecies);

router.use("/chat", chat);

router.use("/search-images", searchImages);

router.use("/production-modules", productionModules);

router.use("/processogram-images", processogramImages);

export default router;
