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

export type ProcessogramQuestion = {
  question: string;
  answer: string;
};

export type GeneratedProcessogramQuestions = {
  questions: ProcessogramQuestion[];
};

export const generateProcessogramElementQuestions = async ({
  levelName,
  name,
  hierarchy,
}: Params) => {
  const systemPrompt = `
    You are an expert in animal production systems.
    Given the description of a production system element (such as a stage, phase, or animal group), generate 3 informative questions and their corresponding answers.
    Use the name as the main subject, and the level name and parents as background context.
    Your goal is to help someone understand the biological, functional, and management-related aspects of that element.
    Instructions:
    The questions must be relevant to understanding the nature and role of the element
    Use the context from parents to enrich the answers, not to copy them
    Avoid generic trivia or repeating input data
    Answers should be factual and concise, ideally 1–3 sentences

    EXAMPLE INPUT:   
    level name: circumstance;
    name: piglet;
    parents: phase - suckling, life fate - market pig, production system - conventional intensive;

    EXAMPLE JSON OUTPUT:
    {
      "questions": [
        {
          "question": "What defines the piglet stage in pig production?",
          "answer": "The piglet stage refers to the early life of pigs, typically from birth until weaning, during which they are dependent on the sow's milk and require close health monitoring."
        },
        {
          "question": "Why is the suckling phase critical for piglets?",
          "answer": "This phase is vital for growth and immunity development, as piglets receive essential nutrients and maternal antibodies through the sow’s milk."
        },
        {
          "question": "What are common management practices for piglets in intensive systems?",
          "answer": "Common practices include temperature regulation, iron supplementation, tail docking, and monitoring for signs of illness or developmental issues."
        }
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
