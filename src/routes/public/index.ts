import express from "express";
const router = express.Router();

import getProcessograms from "./get-processograms";
import getSpecies from "./get-species";
import chat from "./chat";

router.use("/processograms", getProcessograms);

router.use("/species", getSpecies);

router.use("/chat", chat);

export default router;
