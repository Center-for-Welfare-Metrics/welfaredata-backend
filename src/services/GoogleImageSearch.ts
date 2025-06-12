import axios from "axios";

export type GoogleSearchImageItem = {
  link: string;
  image: {
    thumbnailLink?: string;
  };
};

interface GoogleImageSearchResult {
  items?: GoogleSearchImageItem[];
}

/**
 * Busca imagens no Google Images usando a Custom Search JSON API.
 * @param searchTerm Termo de busca (ex: "cachorros fofos")
 * @returns Promise<string[]> Array com URLs das imagens (até 10 links)
 */
export async function searchGoogleImages(
  searchTerm: string
): Promise<GoogleSearchImageItem[]> {
  const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const CSE_ID = process.env.GOOGLE_CSE_ID;

  if (!API_KEY || !CSE_ID) {
    throw new Error(
      "Variáveis de ambiente GOOGLE_API_KEY e GOOGLE_CSE_ID são obrigatórias."
    );
  }

  const params = {
    key: API_KEY,
    cx: CSE_ID,
    q: searchTerm,
    searchType: "image",
    num: 10,
  };

  try {
    const response = await axios.get<GoogleImageSearchResult>(
      "https://www.googleapis.com/customsearch/v1",
      { params }
    );

    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }

    // Extrai apenas os links das imagens
    return response.data.items;
  } catch (error) {
    console.error("Erro na busca de imagens:", error);
    throw new Error("Falha ao buscar imagens.");
  }
}
