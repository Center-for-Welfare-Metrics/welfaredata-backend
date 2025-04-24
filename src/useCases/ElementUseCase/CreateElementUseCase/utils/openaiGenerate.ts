import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

type Params = {
  production_system_name: string;
  levelName: string;
  name: string;
};

export const generateElementData = async ({
  production_system_name,
  levelName,
  name,
}: Params) => {
  const systemPrompt = `
   You are a data scientist and you have to describe a production system and his levels.
   
   additional informations: consider that --ci is equal circustamce, --ph is equal phase and, --lf is equal life fate.

   EXAMPLE INPUT:
   production system: conventional intensive;
   level name: life fate;
   name: market pig;

   EXAMPLE JSON OUTPUT: 
   {
      "description": "This is a description of the level",
      "duration_label": "2 hours",
      "duration_in_seconds": 7200,
   }
  `;

  const userPrompt = `
    production system: ${production_system_name};
    level name: ${levelName};
    name: ${name};
  `;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messages as any,
    response_format: {
      type: "json_object",
    },
  });

  const data = response.choices[0].message.content;

  if (!data)
    return {
      description: "No description available",
      duration_label: "No duration label available",
      duration_in_seconds: 0,
    };

  const parsedData = JSON.parse(data);

  return {
    description: parsedData.description || "No description available",
    duration_label: parsedData.duration_label || "No duration label available",
    duration_in_seconds: parsedData.duration_in_seconds || 0,
  };
};
