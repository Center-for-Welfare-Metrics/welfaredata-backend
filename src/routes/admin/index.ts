import express from "express";
import { AuthProtected } from "@/middlewares/logged";
const router = express.Router();

import users from "./users";
import roles from "./roles";
import elements from "./element";
import species from "./specie";
import svgData from "./svg-data";

router.all("/*", AuthProtected);

router.use("/users", users);

router.use("/roles", roles);

router.use("/elements", elements);

router.use("/species", species);

router.use("/element-data", svgData);

export default router;
