import express from "express";
const router = express.Router();

import getProcessograms from "./get-processograms";
import getSpecies from "./get-species";

router.use("/processograms", getProcessograms);

router.use("/species", getSpecies);

export default router;
