import { body, query } from "express-validator";

export const updateProcessogramImagesValidator = () => [
  body("key")
    .notEmpty()
    .withMessage("Image key is required")
    .isString()
    .withMessage("Image key must be a string"),

  // No need to validate "file" in body, multer handles file uploads
  body("url").optional().isURL().withMessage("Image URL must be a valid URL"),
];

export const removeImageValidator = () => [
  body("key")
    .notEmpty()
    .withMessage("Image key is required")
    .isString()
    .withMessage("Image key must be a string"),

  body("url")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

export const updateBulkImagesValidator = () => [
  body("images")
    .notEmpty()
    .withMessage("Images object is required")
    .isObject()
    .withMessage("Images must be an object"),
];
