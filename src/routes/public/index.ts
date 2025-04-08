import express from "express";
const router = express.Router();

import getElement from "./get-elements";

router.use("/elements", getElement);

export default router;
