import { body, param } from "express-validator";

export const updateProductionModuleValidator = () => [
  param("id").isMongoId().withMessage("Valid production module ID is required"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("specie_id")
    .optional()
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId"),
];
