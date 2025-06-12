import {
  GoogleSearchImageItem,
  searchGoogleImages,
} from "@/src/services/GoogleImageSearch";
import {
  getOpenAiJSON,
  OpenAiMessage,
} from "@/src/services/OpenAiGenerateJson";
import { getHierarchyString } from "../../ProcessogramUseCase/CreateProcessogramUseCase/utils/extractInfoFromId";
import { RasterizedElementHierarchy } from "../../ProcessogramUseCase/CreateProcessogramUseCase/utils/rasterizeSvg";

export interface SearchImagesRequest {
  hierarchy: RasterizedElementHierarchy[];
}

type SearchImagesResponse = {
  images: GoogleSearchImageItem[];
  searchTerm: string;
};

export class SearchImagesUseCase {
  async execute(params: SearchImagesRequest): Promise<SearchImagesResponse> {
    try {
      const { hierarchy } = params;

      const systemPrompt = `
        You are a data scientist familiar with animal production systems and digital search optimization.
        Given the hierarchical input below, return a single, clear, and effective search term that can be used to find relevant and accurate images of the target (the first element in the parents list) using Google Images.
        Guidelines:
        Focus the term specifically on the visual identity of the target, considering its phase, role, and production context.
        Use plain English and avoid overly technical terms unless they are commonly used in image captions.

        Include qualifiers (like age, phase, or system) if they help narrow the search meaningfully.

        Do not return explanations — only return the search term as a JSON string under the key "search_term".

        EXAMPLE INPUT:
        hierarchy: phase - suckling, life fate - market pig, production system - conventional intensive;

        EXAMPLE JSON OUTPUT:
        {
        "searchTerm": "suckling piglet in intensive farming"
        }
      `;

      const hierarchyString = getHierarchyString(hierarchy);

      const userPrompt = `    
          hierarchy: ${hierarchyString};
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

      const aiResponse = await getOpenAiJSON<{ searchTerm: string }>(messages);

      if (!aiResponse || !aiResponse.searchTerm) {
        throw new Error("Failed to generate search term from AI response");
      }

      const images = await searchGoogleImages(aiResponse.searchTerm.trim());

      return {
        images: images,
        searchTerm: aiResponse.searchTerm.trim(),
      };
    } catch (error: any) {
      console.error("Error in SearchImagesUseCase:", error);
      throw new Error(error.message || "Failed to search images");
    }
  }
}
