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
  check()
    .custom((_, { req }) => {
      if (!req.file) {
        throw new Error("File is required");
      }

      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      if (fileExtension !== ".svg") {
        throw new Error("Only SVG files are allowed");
      }

      return true;
    })
    .withMessage("File is required"),
];
