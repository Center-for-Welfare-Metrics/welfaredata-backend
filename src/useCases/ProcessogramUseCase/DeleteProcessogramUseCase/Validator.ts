import { param } from "express-validator";

export const deleteProcessogramValidator = () => [
  param("id").isMongoId().withMessage("Valid processogram ID is required"),
];
