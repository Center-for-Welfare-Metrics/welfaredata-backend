import { param } from "express-validator";

export const deleteProductionModuleValidator = () => [
  param("id").isMongoId().withMessage("Valid production module ID is required"),
];
