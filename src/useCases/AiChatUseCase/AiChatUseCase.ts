import {
  OpenAiMessage,
  ProcessogramHierarchy,
  streamOpenAiChat,
} from "@/src/services/OpenAiChatSteam";
import { Stream } from "openai/streaming";
import OpenAI from "openai";

export class AiChatUseCase {
  async execute(
    messages: OpenAiMessage[],
    hierarchy: ProcessogramHierarchy[]
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error("Messages must be a non-empty array");
      }

      for (const message of messages) {
        if (!["system", "user", "assistant"].includes(message.role)) {
          throw new Error(
            "Message role must be one of: system, user, assistant"
          );
        }

        if (
          typeof message.content !== "string" ||
          message.content.trim() === ""
        ) {
          throw new Error("Message content must be a non-empty string");
        }
      }

      const stream = await streamOpenAiChat(messages, hierarchy);

      return stream;
    } catch (error: any) {
      console.error("Error in AiChatUseCase:", error);
      throw new Error(error.message || "Failed to generate AI response");
    }
  }
}
