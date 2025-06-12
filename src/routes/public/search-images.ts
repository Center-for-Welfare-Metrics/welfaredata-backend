import express from "express";

const router = express.Router();

import SearchImagesController from "@/src/useCases/GoogleSearchUseCase/SearchImagesUseCase/SearchImagesController";
import { searchImagesValidator } from "@/src/useCases/GoogleSearchUseCase/SearchImagesUseCase/SearchImagesValidator";
import { validate } from "@/src/utils/validate";

router.post(
  "/",
  searchImagesValidator(),
  validate,
  SearchImagesController.search
);

export default router;
