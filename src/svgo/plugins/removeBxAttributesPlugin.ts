import { RequiredPlugins } from "../types";

export const removeBxAttributesPlugin: RequiredPlugins[number] = {
  name: "removeAttributesPlugin",
  fn: () => {
    return {
      element: {
        enter: (node) => {
          const bxOriginAttr = node.attributes["bx:origin"];

          if (bxOriginAttr) {
            console.log("deleted bx:origin attribute");
            delete node.attributes["bx:origin"];
          }
        },
      },
    };
  },
};
