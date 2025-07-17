import { body } from "express-validator";

export const deleteMultipleValidator = () => [
  body("ids")
    .notEmpty()
    .withMessage("IDs array is required")
    .isArray({ min: 1 })
    .withMessage("IDs must be a non-empty array"),

  body("ids.*")
    .isMongoId()
    .withMessage("Each ID must be a valid MongoDB ObjectId"),
];
