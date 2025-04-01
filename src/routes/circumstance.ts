import express from "express";

import CrudController from "@/controllers/CrudController";

import CircumstanceModel from "@/models/old/Circumstance";

import PC from "@/controllers/ProcessogramController";

import { AuthProtected } from "@/middlewares/logged";

const router = express.Router();

const multer = require("multer");

const upload = multer();

const Controller = new CrudController(CircumstanceModel);

router.all("/*", AuthProtected);

router.get("", Controller.read);

router.post("", Controller.create);

router.patch("/:_id/upload", upload.single("file"), Controller.upload);

router.patch("/:_id/newmedia", Controller.addMedia);

router.patch("/:_id/:specie", Controller.update_next);

router.delete("/:_id", Controller.deleteById);

router.post("/getOneReference", Controller.read_one);

export default router;
