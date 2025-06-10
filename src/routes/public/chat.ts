import express from "express";
import {
  aiChatController,
  aiChatValidator,
} from "@/src/useCases/AiChatUseCase/AiChatController";
import { validate } from "@/src/utils/validate";

const router = express.Router();

router.post("/", aiChatValidator(), validate, aiChatController.chat);

export default router;
