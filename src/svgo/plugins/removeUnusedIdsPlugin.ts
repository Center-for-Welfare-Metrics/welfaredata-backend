import { RequiredPlugins } from "../types";

export const removeUnusedIdsPlugin: RequiredPlugins[number] = {
  name: "removeUnusedIds",
  fn: () => {
    return {
      element: {
        enter: (node) => {
          const id = node.attributes.id;

          if (!id) return;

          const isIdUsed = id.includes("--");

          if (isIdUsed) return;

          delete node.attributes.id;
        },
      },
    };
  },
};
