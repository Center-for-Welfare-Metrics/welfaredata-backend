import express from "express";
import { AuthProtected } from "@/middlewares/logged";

const router = express.Router();

import species from "./species";
import processograms from "./processogram";
import processogramDatas from "./processogram-datas";
import productionModules from "./production-modules";
import processogramImages from "./processogram-images";
import registrationCode from "./registration-code";

router.all("/*", AuthProtected);

router.use("/processograms", processograms);

router.use("/species", species);

router.use("/processogram-datas", processogramDatas);

router.use("/production-modules", productionModules);

router.use("/processogram-images", processogramImages);

router.use("/registration-code", registrationCode);

export default router;
