import express from "express";
const router = express.Router();

import getProcessograms from "./get-processograms";
import getSpecies from "./get-species";
import chat from "./chat";
import searchImages from "./search-images";
import productionModules from "./get-production-module";

router.use("/processograms", getProcessograms);

router.use("/species", getSpecies);

router.use("/chat", chat);

router.use("/search-images", searchImages);

router.use("/production-modules", productionModules);

export default router;
