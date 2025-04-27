import { deslugify } from "@/src/utils/string";
import OpenAI from "openai";
import { RasterizedElementHierarchy } from "./rasterizeSvg";
import { getHierarchyString } from "./extractInfoFromId";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

type Params = {
  production_system_name: string;
  levelName: string;
  name: string;
  hierarchy: RasterizedElementHierarchy[];
};

export const generateElementData = async ({
  levelName,
  name,
  hierarchy,
}: Params) => {
  const systemPrompt = `
  You are a data scientist specializing in animal production systems.
  Given the inputs below, generate a detailed and informative description of the object (animal, phase, etc.) focusing on biological characteristics, typical behavior, purpose within the production system, and commercial importance.
  Also estimate a typical duration for this level, including a label (e.g., "5 weeks") and the equivalent value in seconds.
  Important: Do not just restate the inputs. Expand with plausible details based on common knowledge of conventional intensive pig farming or similar production systems.

  EXAMPLE INPUT:   
  level name: circumstance;
  name: piglet;
  parents: phase - suckling, life fate - market pig, production system - conventional intensive;

  EXAMPLE JSON OUTPUT: 
  {
    "description": "This is a description of the level",
    "duration_label": "2 hours",
    "duration_in_seconds": 7200,
  }

   if no parents are provided, that means that the level is the root of the production system.
  `;

  const hierarchyString = getHierarchyString(hierarchy);

  const userPrompt = `    
    level name: ${levelName};
    name: ${deslugify(name)};
    parents: ${hierarchyString};
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
