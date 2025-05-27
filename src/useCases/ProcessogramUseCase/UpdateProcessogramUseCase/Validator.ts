import { body, param } from "express-validator";

export const updateProcessogramValidator = () => [
  param("id").isMongoId().withMessage("Valid processogram ID is required"),
  body("specie_id")
    .optional()
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ID"),
  body("production_module_id")
    .optional()
    .isMongoId()
    .withMessage("Production module ID must be a valid MongoDB ID"),
  body("theme")
    .optional()
    .isIn(["light", "dark"])
    .withMessage("Theme must be either 'light' or 'dark'"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("is_published")
    .optional()
    .isBoolean()
    .withMessage("is_published must be a boolean"),
];
