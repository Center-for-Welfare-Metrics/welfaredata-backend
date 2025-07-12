import { RequiredPlugins } from "../types";

const findElementWithPsId = (children: any[]): any => {
  for (const child of children) {
    if (child.type === "element" && child.attributes?.id?.includes("--ps")) {
      return child;
    }

    // Busca recursivamente nos filhos
    if (child.children && child.children.length > 0) {
      const found = findElementWithPsId(child.children);
      if (found) return found;
    }
  }
  return null;
};

export const fixMissingSvgIdPlugin: RequiredPlugins[number] = {
  name: "fixMissingSvgId",
  fn: () => {
    let processedRoot = false;

    return {
      element: {
        enter(node) {
          console.log("fixMissingSvgIdPlugin: entering node", node.name);
          console.log("node type", node.type);

          if (processedRoot) return;

          if (node.name !== "svg") return;

          processedRoot = true;

          if (node.attributes.id && node.attributes.id.includes("--ps")) {
            return;
          }

          console.log("svg do not have id, fixing it");

          console.log("node children", node.children);

          const elementWithPsId = findElementWithPsId(node.children);

          if (elementWithPsId) {
            const psId = elementWithPsId.attributes.id;

            // Se for um elemento <g>, você pode querer remover o wrapper
            if (elementWithPsId.name === "g") {
              // Encontra o índice do elemento no seu pai
              const removeGTag = (
                children: any[],
                targetElement: any
              ): boolean => {
                const index = children.findIndex(
                  (child) => child === targetElement
                );
                if (index !== -1) {
                  children.splice(index, 1, ...targetElement.children);
                  return true;
                }

                // Busca recursivamente
                for (const child of children) {
                  if (
                    child.children &&
                    removeGTag(child.children, targetElement)
                  ) {
                    return true;
                  }
                }
                return false;
              };

              removeGTag(node.children, elementWithPsId);
            }

            // Atribui o ID ao <svg>
            node.attributes.id = psId;
          } else {
            console.log(
              "svg do not have element with id containing --ps, skipping fix"
            );
          }
        },
      },
    };
  },
};
