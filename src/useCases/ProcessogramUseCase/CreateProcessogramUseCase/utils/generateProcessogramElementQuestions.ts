import { deslugify } from "@/src/utils/string";
import OpenAI from "openai";
import { RasterizedElementHierarchy } from "./rasterizeSvg";
import { getHierarchyString } from "./extractInfoFromId";
import {
  getOpenAiJSON,
  OpenAiMessage,
} from "@/src/services/OpenAiGenerateJson";

type Params = {
  production_system_name: string;
  levelName: string;
  name: string;
  hierarchy: RasterizedElementHierarchy[];
};

export type GeneratedProcessogramQuestions = {
  questions: string[];
};

export const generateProcessogramElementQuestions = async ({
  levelName,
  name,
  hierarchy,
}: Params) => {
  const systemPrompt = `
    You are a data scientist specializing in animal production systems.
    Given the input below, your task is to generate 4 short and relevant questions that could be used to initiate a conversation about the target level (the first item in the parents list). These questions should:

    Be informative, curious, or analytical in nature.
    Be phrased naturally, as if coming from a user seeking to understand more about the topic.
    Take into account the hierarchical context that follows the target, but keep the focus of the question on the target only.
    Avoid unnecessary technical jargon; the tone should be accessible and practical.
    Do not explain or repeat the hierarchy in your output — just provide the list of questions.
    Return the questions in a JSON object with the key questions.

    EXAMPLE INPUT:
    level name: circumstance;
    name: piglet;
    parents: phase - suckling, life fate - market pig, production system - conventional intensive;

    EXAMPLE JSON OUTPUT:
      {
      "questions": [
        "What are common stressors for piglets in the suckling phase?",
        "How does this stage impact the piglet's growth trajectory?",
        "What kind of care do piglets typically require at this point?",
        "Are piglets in this context already being prepared for market?"
      ]
    }
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

  const responseData = await getOpenAiJSON<GeneratedProcessogramQuestions>(
    messages
  );

  if (!responseData)
    return {
      questions: [],
    };

  return {
    questions: responseData.questions || [],
  };
};
