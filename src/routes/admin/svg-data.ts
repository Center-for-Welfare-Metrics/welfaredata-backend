import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import ListSvgDataController from "@/src/useCases/SvgDataUseCase/ListSvgDataUseCase/ListSvgDataController";

const router = express.Router();

router.all("/*", AuthProtected);

// List SVG data by specie ID
router.get("/", ListSvgDataController.list);

// Get SVG data by ID
router.get("/:id", ListSvgDataController.getById);

// Get SVG data by SVG element ID
router.get("/by-element/:element_id", ListSvgDataController.getBySvgElementId);

export default router;
