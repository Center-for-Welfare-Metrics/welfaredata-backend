import express from "express";
import { AuthProtected } from "@/middlewares/logged";
const router = express.Router();

import users from "./users";
import roles from "./roles";
import elements from "./element";
import species from "./specie";

router.all("/*", AuthProtected);

router.use("/users", users);

router.use("/roles", roles);

router.use("/elements", elements);

router.use("/species", species);

export default router;
