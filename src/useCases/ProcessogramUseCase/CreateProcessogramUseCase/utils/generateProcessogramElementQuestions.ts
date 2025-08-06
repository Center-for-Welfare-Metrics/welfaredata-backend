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
  
You are an animal scientist specializing in animal production systems.
Given the input below, your task is to generate 4 thoughtful, context-aware questions that encourage deep engagement with the target level (the first item in the parents list). These questions should:
Be informative, curious, or analytical, prompting reflection on biological, commercial, operational, or welfare aspects.
Be phrased naturally, as if from a user seeking deeper understanding of the component.
Take into account the hierarchical context (e.g., species, life-fate, phase) to inform questions, but keep the focus strictly on the target component.
When relevant, highlight aspects affecting animal quality of life (e.g., stress, health, behavior) or production system implications (e.g., efficiency, outcomes).
Avoid unnecessary technical jargon; maintain an accessible, practical tone.
Do not explain or repeat the hierarchy in questions or output — just provide the list of questions.
Return the questions in a JSON object with the key "questions".
If input is invalid or incomplete, output JSON with "questions": [] and add "error": "Brief reason".
EXAMPLE INPUT:
level name: circumstance;
name: piglet;
parents: phase - suckling, life fate - market pig, production system - conventional intensive;
EXAMPLE JSON OUTPUT:
{
"questions": [
"What are common stressors for piglets in the suckling phase, and how do they impact long-term welfare?",
"How does the suckling phase influence piglet growth and immune development in market pigs?",
"What management practices during suckling can improve piglet health outcomes in intensive systems?",
"Are there ways to enhance piglet socialization during suckling to reduce future behavioral issues?"
]
}
EXAMPLE INPUT (Phase):
level name: phase;
name: crowding at plant;
parents: life fate - market trout, production system - flow-through tank slaughter;
EXAMPLE JSON OUTPUT:
{
"questions": [
"How does crowding at the plant affect trout stress levels and welfare before stunning?",
"What operational factors during plant crowding can minimize injury risks for market trout?",
"Why is water quality monitoring crucial in the crowding phase for trout in flow-through systems?",
"How might crowding duration influence the overall efficiency of the slaughter process for trout?"
]
}
EXAMPLE INPUT (Life-Fate):
level name: life fate;
name: market pig;
parents: production system - conventional intensive;
EXAMPLE JSON OUTPUT:
{
"questions": [
"What key experiences define the life of a market pig in conventional intensive systems?",
"How do housing conditions impact the quality of life for market pigs throughout their growth?",
"What are the main welfare challenges faced by market pigs destined for meat production?",
"How does the market pig path balance commercial productivity with animal health considerations?"
]
}
EXAMPLE INPUT (Production System - Root):
level name: production system;
name: conventional intensive;
parents: none;
EXAMPLE JSON OUTPUT:
{
"questions": [
"What are the core features of a conventional intensive production system for pigs?",
"How does conventional intensive farming affect animal welfare in pig production?",
"What efficiency benefits does conventional intensive systems offer for market pig rearing?",
"Are there ways to improve sustainability in conventional intensive pig production systems?"
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
