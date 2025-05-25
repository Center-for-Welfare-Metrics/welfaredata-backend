import { body, param } from "express-validator";

export const updateProcessogramDataValidator = () => [
  param("id").isMongoId().withMessage("Valid processogram data ID is required"),
  body("key").isString().withMessage("Key must be a string"),
  body("description").isString().withMessage("Description must be a string"),
];
