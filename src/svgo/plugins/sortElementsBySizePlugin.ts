import { RequiredPlugins } from "../types";

export const sortElementsBySizePlugin: RequiredPlugins[number] = {
  name: "sortElementsBySize",
  fn: () => {
    return {
      element: {
        enter: (node, parentNode) => {
          const id = node.attributes.id;
          if (!id) return;
          parentNode.children.sort((a, b) => {
            if (!("attributes" in a) || !("attributes" in b)) return 0;

            const aSize = a.attributes.width;
            const bSize = b.attributes.width;

            return 0;
          });
        },
      },
    };
  },
};
