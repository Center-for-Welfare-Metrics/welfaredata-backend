import { RequiredPlugins } from "../types";

export const fixMissingSvgIdPlugin: RequiredPlugins[number] = {
  name: "fixMissingSvgId",
  fn: () => {
    let processedRoot = false;

    return {
      element: {
        enter(node) {
          if (!processedRoot && node.name === "svg") {
            processedRoot = true;

            if (node.attributes.id && node.attributes.id.endsWith("--ps")) {
              return;
            }

            const gIndex = node.children.findIndex((child) => {
              return (
                child.type === "element" &&
                child.name === "g" &&
                child.attributes?.id?.endsWith("--ps")
              );
            });

            if (gIndex !== -1) {
              const gTag = node.children[gIndex];

              if (gTag.type !== "element") {
                return;
              }

              // TypeScript agora sabe que é um XastElement
              const psId = gTag.attributes.id;
              const gChildren = gTag.children;

              // Remove o <g> e coloca os filhos no mesmo lugar
              node.children.splice(gIndex, 1, ...gChildren);

              // Atribui o ID ao <svg>
              node.attributes.id = psId;
            }
          }
        },
      },
    };
  },
};
