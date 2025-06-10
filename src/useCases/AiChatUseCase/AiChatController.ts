import { Request, Response } from "express";
import { AiChatUseCase } from "./AiChatUseCase";
import { body } from "express-validator";
import { ProcessogramHierarchy } from "@/src/services/OpenAiChatSteam";

export const aiChatValidator = () => [
  body("messages")
    .isArray()
    .withMessage("Messages must be an array")
    .notEmpty()
    .withMessage("Messages are required"),
  body("messages.*.role")
    .isIn(["system", "user", "assistant"])
    .withMessage("Message role must be one of: system, user, assistant"),
  body("messages.*.content")
    .isString()
    .withMessage("Message content must be a string")
    .notEmpty()
    .withMessage("Message content cannot be empty"),
  body("hierarchy")
    .isArray()
    .withMessage("Hierarchy must be an array")
    .notEmpty()
    .withMessage("Hierarchy is required"),
];

type RequestBody = {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  hierarchy: ProcessogramHierarchy[];
};

class AiChatController {
  async chat(req: Request, res: Response) {
    try {
      const { messages, hierarchy } = req.body;

      const aiChatUseCase = new AiChatUseCase();

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await aiChatUseCase.execute(messages, hierarchy);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Error in AiChatController.chat:", error);

      if (!res.headersSent) {
        return res.status(500).json({
          error: error.message || "Failed to generate AI response",
        });
      } else {
        res.write(
          `data: ${JSON.stringify({
            error: error.message || "Failed to generate AI response",
          })}\n\n`
        );
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  }
}

export const aiChatController = new AiChatController();
