import express from "express";
import { AuthProtected } from "@/middlewares/logged";
import { SuperUserProtected } from "@/src/middlewares/super-user";
import { getRegistrationCodeController } from "@/src/useCases/RegistrationCodeUseCase/GetRegistrationCodeUseCase/GetRegistrationCodeController";

const router = express.Router();

router.all("/*", AuthProtected, SuperUserProtected);

// Get registration code (super user only)
router.get("/", getRegistrationCodeController.get);

export default router;
