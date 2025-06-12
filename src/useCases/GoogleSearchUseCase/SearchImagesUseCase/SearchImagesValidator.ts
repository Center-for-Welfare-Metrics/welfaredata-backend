import { body } from "express-validator";

export const searchImagesValidator = () => [
  body("hierarchy")
    .isArray()
    .withMessage("hierarchy must be an array")
    .notEmpty()
    .withMessage("hierarchy cannot be empty"),
];
