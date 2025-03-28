import { Config } from "svgo";

type RequiredPlugins = Required<Config>["plugins"];

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

export const sortElementsBySizePlugin: RequiredPlugins[number] = {
  name: "sortElementsBySize",
  fn: () => {
    return {
      element: {
        enter: (node, parentNode) => {
          const id = node.attributes.id;
          if (!id) return;
          console.log("rapaz...");
          parentNode.children.sort((a, b) => {
            console.log("here");
            if (!("attributes" in a) || !("attributes" in b)) return 0;

            const aSize = a.attributes.width;
            const bSize = b.attributes.width;

            console.log(aSize, bSize);

            return 0;
          });
        },
      },
    };
  },
};
