import express from "express";

const router = express.Router();

import AuthController from "@/controllers/AuthController";

import UserController from "@/controllers/UserController";

import AuthValidator from "@/helpers/validators/auth-validator";

import { OnlyGuest, AuthProtected } from "@/middlewares/logged";

router.post("/login", OnlyGuest, AuthValidator.login, AuthController.login);

router.post(
  "/register",
  OnlyGuest,
  AuthValidator.register,
  AuthController.register
);

router.post("/logout", AuthProtected, AuthController.logout);

router.get("/user", AuthProtected, UserController.get);

export default router;
