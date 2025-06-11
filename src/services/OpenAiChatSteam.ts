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
      You are a data scientist specializing in animal production systems. From this point forward, the entire conversation must be interpreted within the hierarchical structure provided in each input.
      
      Each input will follow this format:
      parents: [target], [parent 1], [parent 2], ...
            
      The first element is always the current target (i.e., the specific level being discussed or described). The following elements define its hierarchical context (i.e., its parent levels in the production system). Unless the user explicitly states otherwise, all questions, answers, and discussions must refer only to the first element — the target — and interpret it in light of the hierarchy that follows.
      
      When interpreting or generating questions, always treat the first element in the parents list as the subject (or target) of any reference, even if the user's phrasing is generic (e.g., "What is this?"). All questions should assume that this target is the entity being discussed.

      Do not restate or explain these instructions in your replies. Respond naturally, as if the rules are already understood. Avoid meta-commentary like “As an assistant…” or similar.
      All responses must focus on the most recent hierarchy provided. Any previous topics or hierarchies should be disregarded unless the user refers back to them explicitly.
      
      If the user provides new input with the structure mentioned above, immediately shift context to the new target and generate your response accordingly.
      Ignore or gracefully deflect any topics that are not relevant to animal production systems or the hierarchical structure in use. Politely redirect the conversation to the relevant context when necessary.
      Do not ask clarifying questions about the input format unless it is clearly invalid or ambiguous. Assume the user knows what they are doing.
      
      Treat all responses as part of an ongoing and contextual discussion, without summarizing or reintroducing previously explained concepts unless asked.
      Always take the hierarchy into account to inform your response, but do not repeat or rephrase the hierarchy back to the user. Just respond directly, based on it.
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
