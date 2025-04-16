import express from "express";
import { AuthProtected } from "@/middlewares/logged";
const router = express.Router();

import users from "./users";
import roles from "./roles";
import uploadSvg from "./upload-svg";
import specie from "./specie";

router.all("/*", AuthProtected);

router.use("/users", users);

router.use("/roles", roles);

router.use("/upload-svg", uploadSvg);

router.use("/specie", specie);

export default router;
