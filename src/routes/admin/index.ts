import express from "express";
import { AuthProtected } from "@/middlewares/logged";

const router = express.Router();

import species from "./species";
import processograms from "./processogram";
import processogramDatas from "./processogram-datas";
import processogramQuestions from "./processogram-questions";
import productionModules from "./production-modules";

router.all("/*", AuthProtected);

router.use("/processograms", processograms);

router.use("/species", species);

router.use("/processogram-datas", processogramDatas);

router.use("/processogram-questions", processogramQuestions);

router.use("/production-modules", productionModules);

export default router;
