import { RequiredPlugins } from "../types";

const extractNumericValue = (value: string): number | null => {
  // Remove unidades como px, em, %, etc. e converte para número
  const numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
  return isNaN(numericValue) ? null : numericValue;
};

export const addViewBoxPlugin: RequiredPlugins[number] = {
  name: "addViewBox",
  fn: () => {
    let processedRoot = false;

    return {
      element: {
        enter(node) {
          if (processedRoot) return;

          if (node.name !== "svg") return;

          processedRoot = true;

          // Se já tem viewBox, não faz nada
          if (node.attributes.viewBox) {
            return;
          }

          // Verifica se tem width e height
          const width = node.attributes.width;
          const height = node.attributes.height;

          if (!width || !height) {
            console.log(
              "SVG doesn't have width or height, skipping viewBox addition"
            );
            return;
          }

          // Extrai valores numéricos
          const numericWidth = extractNumericValue(width);
          const numericHeight = extractNumericValue(height);

          if (numericWidth === null || numericHeight === null) {
            console.log(
              "Could not extract numeric values from width/height, skipping viewBox addition"
            );
            return;
          }

          // Adiciona viewBox baseado no width e height
          node.attributes.viewBox = `0 0 ${numericWidth} ${numericHeight}`;
          console.log(`Added viewBox: 0 0 ${numericWidth} ${numericHeight}`);

          // Remove os atributos width e height após adicionar viewBox
          delete node.attributes.width;
          delete node.attributes.height;
          console.log("Removed width and height attributes");
        },
      },
    };
  },
};
