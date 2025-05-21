import { body, param } from "express-validator";

export const updateSpecieValidator = () => [
  param("id").isMongoId().withMessage("Valid species ID is required"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("pathname")
    .optional()
    .isString()
    .withMessage("Pathname must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];
