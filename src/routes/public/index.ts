import express from "express";
const router = express.Router();

import getProcessograms from "./get-processograms";
import getSpecies from "./get-species";
import chat from "./chat";
import searchImages from "./search-images";

router.use("/processograms", getProcessograms);

router.use("/species", getSpecies);

router.use("/chat", chat);

router.use("/search-images", searchImages);

export default router;
