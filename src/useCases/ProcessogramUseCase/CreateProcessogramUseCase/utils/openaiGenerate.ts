import { deslugify } from "@/src/utils/string";
import OpenAI from "openai";
import { RasterizedElementHierarchy } from "./rasterizeSvg";
import { getHierarchyString } from "./extractInfoFromId";
import {
  getOpenAiJSON,
  OpenAiMessage,
} from "@/src/services/OpenAiGenerateJson";

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

type GeneratedElementData = {
  description: string;
  duration_label: string;
  duration_in_seconds: number;
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

  const messages: OpenAiMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const responseData = await getOpenAiJSON<GeneratedElementData>(messages);

  if (!responseData)
    return {
      description: "No description available",
      duration_label: "No duration label available",
      duration_in_seconds: 0,
    };

  return {
    description: responseData.description || "No description available",
    duration_label:
      responseData.duration_label || "No duration label available",
    duration_in_seconds: responseData.duration_in_seconds || 0,
  };
};
