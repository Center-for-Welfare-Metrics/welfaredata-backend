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
You are an animal scientist specializing in animal production systems.


Your task is to generate clear, accurate, and insightful descriptions of components in detailed diagrams of animal production processes, based on the component's level and name. The level may be production system (root level, overarching process), life-fate (animal's path or destiny), phase (temporal stage), or circumstance (localized structure, space, equipment, operation, or animal in context). Always base descriptions on established scientific knowledge, focusing on biological, commercial, and operational relevance, and highlight aspects affecting animal quality of life (e.g., stress, injury risks, behavioral responses) when relevant to the component.


Important:


- Focus the description strictly on the named component, using the parent hierarchy only for brief contextual framing (e.g., "within [parent phase]") without shifting emphasis.


- Always integrate the species in focus, inferring from parents if not explicit, and tailor details to species-specific traits.


- Keep descriptions concise (3-5 sentences), neutral, and insightful, avoiding speculation.


- If the item is a 'production system', describe the overall process, its structure, key sequences, commercial goals, and broad welfare implications for the animals involved.


- If the item is a 'life-fate', describe the animal type following this path, characterizing its experience, key life stages, and welfare factors like housing or handling.


- If the item is a 'phase', describe the time period, typical activities, biological/commercial relevance, role in the sequence, and relevant quality of life impacts (e.g., stressors or enrichments).


- If the item is a 'circumstance', describe it as a localized structure, space, equipment element animals interact with (e.g., ramp, tray, enclosure, crate) or an animal itself in that context (e.g., a cow being dehorned), including function, design features, and direct welfare effects.


- If no parents are provided, treat the level as the root production system.


- If input is invalid or incomplete, output JSON with "description": "Error: Invalid input - [brief reason]".


EXAMPLE 1 — (Circumstance):


level name: circumstance
name: ramp
parents: phase - chicks tipped from trays, life-fate - female chick, production system - industrial hatchery


Expected JSON output:


{


"description": "The ramp is a downward-sloping structure within the chicks tipped from trays phase, allowing newly hatched chicks to exit incubation trays and continue along the production line. It supports gravity-based movement and reduces handling stress during transfer, with a textured or ridged surface to prevent slipping and an angle calibrated to minimize injury risk for fragile chicks, potentially affecting their early quality of life by promoting safe transition."


}


EXAMPLE 2 — (Phase):
level name: phase
name: crowding at plant
parents: life-fate - market trout, production system - flow-through tank slaughter
Expected JSON output:


{


"description": "In the crowding at plant phase within the market trout life-fate, trout are gradually moved into a confined holding area in preparation for stunning, with fish densities increasing significantly to facilitate transfer. This phase requires careful water quality monitoring for biological relevance and commercial efficiency, but can trigger strong aversive reactions and stress if poorly managed, impacting fish quality of life through potential hypoxia or injury."


}


EXAMPLE 3 — (Life-Fate):


level name: life-fate
name: female chick
parents: production system - industrial hatchery


Expected JSON output:


{


"description": "The female chick life-fate in an industrial hatchery involves young hens selected for egg production, characterized by early sorting, rearing in controlled environments, and preparation for laying phases. Their experience includes high-density housing and minimal handling, with welfare factors like beak trimming potentially causing pain but aiming to prevent feather pecking in later stages."


}


EXAMPLE 4 — (Production System):


level name: production system
name: industrial hatchery
parents: none


Expected JSON output:


{


"description": "The industrial hatchery production system encompasses the large-scale incubation, hatching, and initial processing of poultry eggs to produce day-old chicks for farming. It features automated equipment for efficiency and biosecurity, with commercial goals of high yield and uniformity, though welfare implications include early sexing stress and culling of males, affecting chick quality of life from the outset."


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
