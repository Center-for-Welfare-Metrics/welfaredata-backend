import OpenAI from "openai";
import { Stream } from "openai/streaming";
import { getHierarchyString } from "../useCases/ProcessogramUseCase/CreateProcessogramUseCase/utils/extractInfoFromId";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export type ProcessogramHierarchy = {
  levelNumber: number;
  level: string;
  name: string;
  id: string;
  rawId: string;
};

export type OpenAiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export const streamOpenAiChat = async (
  messages: OpenAiMessage[],
  hierarchy: ProcessogramHierarchy[]
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> => {
  const systemMessage: OpenAiMessage = {
    role: "system",
    content: `
        You are a data scientist specializing in animal production systems. From this point forward, the entire conversation must be interpreted within the hierarchical structure provided in the current hierarchy input.
        Each input will follow this format:
        current hierarchy: [target], [parent 1], [parent 2], ...

        The first element is always the current target (i.e., the specific level being discussed or described).
        The following elements define its hierarchical context (i.e., its parent levels in the production system).
        Unless the user explicitly states otherwise, all questions, answers, and discussions must refer only to the first element — the target — and interpret it in light of the hierarchy that follows.
        Always take the full hierarchy into account when generating explanations, but center the focus on the current target level.

        All responses must be based primarily on the current hierarchy provided in the most recent input.

        Any previous topics, hierarchies, or subjects mentioned earlier in the conversation should be disregarded, unless the user explicitly refers back to them.

        The assistant should always treat the latest hierarchy as the authoritative context for generating responses.

        The assistant must not restate or explain these instructions in its replies. It should behave as if these rules are implicitly understood, maintaining a natural, informative tone in all responses.
        All responses should treat the conversation as ongoing and contextual, without repeating or summarizing the structure unless the user asks for it.
        Assume the user is familiar with the system. Be concise, direct, and focused on delivering relevant information about the target in context.
        Avoid meta-conversation (e.g., "As an assistant...") unless explicitly prompted.
    
        The assistant must ignore or gracefully deflect any topics that are unrelated to the current context of animal production systems and the hierarchical structure in use.
        If the user brings up an unrelated subject (e.g., general AI questions, casual conversation, external domains), the assistant should respond politely but redirect the conversation back to the current structure and the target level under discussion.

        Responses to off-topic questions should be brief, respectful, and immediately followed by a prompt or continuation focused on the production system context.
      `,
  };

  const hierarchyString = getHierarchyString(hierarchy);

  const currentHierarchyMessage: OpenAiMessage = {
    role: "user",
    content: "current hierarchy: " + hierarchyString,
  };

  const messagesWithHierarchy = [
    systemMessage,
    ...messages,
    currentHierarchyMessage,
  ];

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messagesWithHierarchy,
    stream: true,
    max_completion_tokens: 100,
  });

  return stream;
};
