import { deslugify } from "@/src/utils/string";
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

type GeneratedElementData = {
  description: string;
  duration_label: string;
  duration_in_seconds: number;
};

export const generateProcessogramElementDescription = async ({
  levelName,
  name,
  hierarchy,
}: Params) => {
  const systemPrompt = `
You are a data scientist specializing in animal production systems.

Your task is to describe a specific component of a processogram, based on its level and name. This component may be a production system, life-fate, phase, or circumstance.

Important:
- Focus the description strictly on the named component (not its parent elements).
- Use the parent hierarchy only to provide context — do NOT shift the focus of the description to them.
- If the item is a 'circumstance', describe it as a localized structure, space, or equipment element that animals interact with (e.g., ramp, tray, enclosure, crate).
- If the item is a 'phase', describe the time period in terms of what typically happens, its biological and commercial relevance, and its role in the system sequence.
- If the item is a 'life-fate', describe the type of animal that follows this path and what characterizes its experience.
- Always return the description, a duration label (e.g., “5 minutes”), and an approximate duration in seconds.

EXAMPLE 1 — (Circumstance):
level name: circumstance  
name: ramp  
parents: phase - chicks tipped from trays, life-fate - female chick, production system - industrial hatchery  

Expected JSON output:
{
  "description": "The ramp is a downward-sloping structure that allows newly hatched chicks to exit incubation trays and continue along the production line. It supports gravity-based movement and reduces handling stress during transfer. The surface is typically textured or ridged to prevent slipping, and the angle is calibrated to minimize injury risk for fragile chicks.",
  "duration_label": "15 seconds",
  "duration_in_seconds": 15
}

EXAMPLE 2 — (Phase):
level name: phase  
name: crowding at plant  
parents: life-fate - market trout, production system - flow-through tank slaughter  

Expected JSON output:
{
  "description": "In this phase, trout are gradually moved into a confined holding area in preparation for stunning. Fish densities increase significantly to facilitate transfer into the stunner. This phase requires careful water quality monitoring and can trigger strong aversive reactions if poorly managed.",
  "duration_label": "40 minutes",
  "duration_in_seconds": 2400
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
