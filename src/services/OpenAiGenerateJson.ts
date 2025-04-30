import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export type OpenAiMessage = {
  role: "system" | "user";
  content: string;
};

export const getOpenAiJSON = async <T = any>(
  messages: OpenAiMessage[]
): Promise<T | null> => {
  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messages,
    response_format: {
      type: "json_object",
    },
  });

  const data = response.choices[0].message.content;

  if (!data) return null;

  try {
    const parsedData = JSON.parse(data);

    return parsedData as T;
  } catch (e) {
    console.error("Error parsing JSON data:", e);
    return null;
  }
};
