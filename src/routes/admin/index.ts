import express from "express";
import { AuthProtected } from "@/middlewares/logged";

const router = express.Router();

import species from "./species";
import processograms from "./processogram";
import processogramDatas from "./processogram-datas";

router.all("/*", AuthProtected);

router.use("/processograms", processograms);

router.use("/species", species);

router.use("/processogram-datas", processogramDatas);

export default router;
