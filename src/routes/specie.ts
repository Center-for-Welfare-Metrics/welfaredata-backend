import express from "express";

const router = express.Router();

import CrudController from "@/controllers/CrudController";

import SpecieModel from "@/models/Specie";

import { AuthProtected } from "@/middlewares/logged";

const multer = require("multer");

const upload = multer();

const Controller = new CrudController(SpecieModel);

router.get("/:_id", Controller.get_one_by_id);

router.all("/*", AuthProtected);

router.get("", Controller.read);

router.post("", Controller.create);

router.patch("/:_id", Controller.update);

router.patch("/:_id/upload", upload.single("file"), Controller.upload);

router.patch("/:_id/newmedia", Controller.addMedia);

router.delete("/:_id", Controller.deleteById);

export default router;
