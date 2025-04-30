import {
  getOpenAiJSON,
  OpenAiMessage,
} from "@/src/services/OpenAiGenerateJson";

type GeneratedSpecieDescription = {
  description: string;
};

type GenerateSpecieDataParams = {
  specieName: string;
};

export const generateSpecieData = async ({
  specieName,
}: GenerateSpecieDataParams) => {
  const systemPrompt = `
    You are building a knowledge base of animal species used in various production systems or domestic contexts.
    Given the name of a species (e.g., pigs, chickens, dogs), return a concise and informative description.

    The description should:
    Present general biological and behavioral traits of the species
    Mention possible uses (e.g., food production, companionship, labor), without tying them to specific systems
    Avoid describing any particular production system or method
    Be useful as an introductory paragraph for someone learning about how this species is managed across different contexts

    EXAMPLE INPUT:
    species: pigs


    EXAMPLE JSON OUTPUT:
    {
      "description": "Pigs are intelligent, social mammals with strong foraging instincts and a diverse omnivorous diet. Domesticated globally, they are valued for their adaptability and rapid growth. Pigs are commonly raised for meat production but also play roles in research and cultural practices. They exhibit complex behaviors and benefit from environments that allow for rooting, exploration, and social interaction."
    }
  `;

  const userPrompt = `
    species: ${specieName}
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

  const responseData = await getOpenAiJSON<GeneratedSpecieDescription>(
    messages
  );

  if (!responseData) {
    console.error("Failed to generate species data");
    return null;
  }

  return responseData;
};
