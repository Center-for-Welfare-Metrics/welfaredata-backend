import { Request } from "express";

export const getLightAndDarkFiles = (req: Request) => {
  let file_light;
  if (
    req.files &&
    typeof req.files === "object" &&
    "file_light" in req.files &&
    Array.isArray(
      (req.files as { [fieldname: string]: Express.Multer.File[] })[
        "file_light"
      ]
    )
  ) {
    file_light = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "file_light"
    ][0];
  }

  let file_dark;
  if (
    req.files &&
    typeof req.files === "object" &&
    "file_dark" in req.files &&
    Array.isArray(
      (req.files as { [fieldname: string]: Express.Multer.File[] })["file_dark"]
    )
  ) {
    file_dark = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      "file_dark"
    ][0];
  }

  return { file_light, file_dark };
};
