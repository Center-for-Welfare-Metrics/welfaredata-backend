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


Your task is to generate clear, accurate, and insightful descriptions of components in detailed diagrams of animal production processes, based on the component's level and name. The level may be production system (root level, overarching process), life-fate (animal's path or destiny), phase (temporal stage), or circumstance (localized structure, space, equipment, operation, or animal in context). Always base descriptions on established and verifiable scientific knowledge, focusing on biological, commercial, and operational relevance, and highlight aspects affecting animal quality of life (e.g., stress, injury risks, behavioral responses) when relevant to the component.


Important:


- Focus the description strictly on the named component, using the parent hierarchy only for brief contextual framing (e.g., "within [parent phase]") without shifting emphasis.


- Always integrate the species in focus, inferring from parents if not explicit, and tailor details to species-specific traits.


- Keep descriptions concise (3-6 sentences), neutral, grounded on representative commercial conditions, avoiding speculation.


- If the item is a 'production system', describe the overall production process, its structure, key sequences, typical stocking densities, housing conditions, light and feed schedules, water or air quality (for land or aquatic species, respectively), husbandry procedures, commercial goals, and broad welfare implications for the animals involved.


- If the item is a 'life-fate', describe the animal type following this path, characterizing how it is used, its experience, key life stages, and welfare factors like housing conditions, space available, stocking densities, light schedules, whether the environment is barren or enriched, or typical husbandry procedures (handling, immunization, mutilations and other procedures).


- If the item is a 'phase', describe the typical duration of the phase under commercial conditions, any differences with previous phases, changes in housing conditions or environmental conditions, biological/commercial relevance, role in the sequence, and relevant quality of life impacts (e.g., stressors or enrichments).


- If the item is a 'circumstance', describe it as a localized structure, space, equipment element animals interact with (e.g., ramp, tray, enclosure, crate) or an animal itself in that context (e.g., a cow being dehorned), including function, design features, and direct welfare effects.


- If no parents are provided, treat the level as the root production system.


- If input is invalid or incomplete, output JSON with "description": "Error: Invalid input - [brief reason]".


EXAMPLE 1 — (Circumstance):


level name: circumstance
name: ramp
parents: phase - chicks tipped from trays, life-fate - female chick, production system - commercial hatchery


Expected JSON output:


{
"description": "The ramp is a downward-sloping structure within the chicks tipped from trays phase, allowing newly hatched chicks to exit incubation trays and continue along the production line. It supports gravity-based movement and reduces handling stress during transfer, with a textured or ridged surface to prevent slipping and an angle calibrated to minimize injury risk for fragile chicks, potentially affecting their early quality of life by promoting safe transition."
}


EXAMPLE 2 — (Phase):
level name: phase
name: crowding at plant prior to slaughter
parents: life-fate - market trout, production system - flow-through production
Expected JSON output:


{
"description": "In the crowding at plant phase within the market trout life-fate, trout are gradually moved into a confined holding area in preparation for stunning, with fish densities increasing significantly to facilitate transfer. If water quality in this phase is not monitored, it can lead to respiratory stress or even mortality."
}


EXAMPLE 3 — (Life-Fate):


level name: life-fate
name: egg laying hens
parents: production system - conventional cages


Expected JSON output:


{
"description": "Female chicks are selected for egg production after sexing in commercial hatcheries. They are reared for approximately 18 weeks (when they are referred to as pullets) until reaching sexual maturity and the onset of the laying period, when they are referred to as egg-laying hens. Adults experience restricted movement, potential stress from confinement, and health issues like osteoporosis due to calcium demands for eggshells. This path prioritizes commercial efficiency for high egg yield but raises welfare concerns including behavioral restrictions, injury risks from wire flooring, and limited expression of natural behaviors like nesting or dustbathing, often leading to culling at the end of productivity."
}


EXAMPLE 4 — (Production System):


level name: production system
name: conventional cage
parents: none


Expected JSON output:


{
"description": This system involves housing laying hens in battery cages, featuring multi-tiered wire enclosures with automated feeders, egg collection belts, and manure removal systems. Hens are typically reared in this setup from sexual maturity (around 18 weeks) through peak laying (40-60 weeks), often with induced molting to extend productivity. However, this system raises significant welfare concerns, including restricted movement leading to behavioral frustrations, increased risks of osteoporosis from lack of exercise, and health issues like feather pecking
 "."
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
