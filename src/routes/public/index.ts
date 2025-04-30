import express from "express";
const router = express.Router();

import getElement from "./get-elements";
import getSpecies from "./get-species";

router.use("/elements", getElement);

router.use("/species", getSpecies);

export default router;
