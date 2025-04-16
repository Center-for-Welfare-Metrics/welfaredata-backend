import { body } from "express-validator";
import path from "path";

export const createSpecieValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Specie is required")
    .isString()
    .withMessage("Specie must be a string"),
  body("pathname")
    .notEmpty()
    .withMessage("Pathname is required")
    .isString()
    .withMessage("Pathname must be a string"),
];
