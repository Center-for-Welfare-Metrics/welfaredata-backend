import { param } from "express-validator";

export const deleteSpecieValidator = () => [
  param("id").isMongoId().withMessage("Valid species ID is required"),
];
