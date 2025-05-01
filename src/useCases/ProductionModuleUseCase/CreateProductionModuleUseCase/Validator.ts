import { body } from "express-validator";

export const createProductionModuleValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("specie_id")
    .notEmpty()
    .withMessage("Specie ID is required")
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId"),
];
