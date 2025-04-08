import { body, check } from "express-validator";
import path from "path";

export const uploadSvgValidator = () => [
  body("specie")
    .notEmpty()
    .withMessage("Specie is required")
    .isString()
    .withMessage("Specie must be a string"),
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
