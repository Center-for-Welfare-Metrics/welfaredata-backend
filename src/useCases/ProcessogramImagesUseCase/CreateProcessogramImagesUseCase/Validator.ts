import { body } from "express-validator";

export const createProcessogramImagesValidator = () => [
  body("specie_id")
    .notEmpty()
    .withMessage("Specie ID is required")
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId"),

  body("processogram_id")
    .notEmpty()
    .withMessage("Processogram ID is required")
    .isMongoId()
    .withMessage("Processogram ID must be a valid MongoDB ObjectId"),
];
