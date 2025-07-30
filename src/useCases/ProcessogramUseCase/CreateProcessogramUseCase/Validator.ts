import { body, check } from "express-validator";
import path from "path";

export const uploadSvgValidator = () => [
  body("name")
    .isString()
    .withMessage("Name is required")
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("specie_id")
    .isMongoId()
    .withMessage("Specie ID must be a valid MongoDB ObjectId")
    .notEmpty(),
  body("production_module_id")
    .isMongoId()
    .withMessage("Production Module ID must be a valid MongoDB ObjectId")
    .notEmpty(),
  body("path").isString().withMessage("Path is required"),
  body("is_published")
    .optional()
    .isBoolean()
    .withMessage("is_published must be a boolean"),
  check()
    .custom((_, { req }) => {
      if (!req.files?.["file_light"]?.[0] && !req.files?.["file_dark"]?.[0]) {
        throw new Error("File is required");
      }

      const file_light = req.file_light;
      const file_dark = req.file_dark;

      if (file_light) {
        const fileExtension = path
          .extname(file_light.originalname)
          .toLowerCase();
        if (fileExtension !== ".svg") {
          throw new Error("Only SVG files are allowed");
        }
      }

      if (file_dark) {
        const fileExtension = path
          .extname(file_dark.originalname)
          .toLowerCase();
        if (fileExtension !== ".svg") {
          throw new Error("Only SVG files are allowed");
        }
      }

      return true;
    })
    .withMessage("File is required"),
];
