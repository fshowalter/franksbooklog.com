import type { Root } from "mdast";
import type { Plugin } from "unified";

import { visit } from "unist-util-visit";

export const remarkPullQuotes: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "blockquote", (node) => {
      const firstChild = node.children[0];

      if (firstChild && firstChild.type === "paragraph") {
        const firstText = firstChild.children[0];

        if (
          firstText &&
          firstText.type === "text" &&
          firstText.value.startsWith("{pullquote}")
        ) {
          // Remove the marker from the text
          firstText.value = firstText.value.replace("{pullquote}", "").trim();

          // Add pull-quote class to the blockquote
          node.data = {
            ...node.data,
            hProperties: {
              ...(node.data?.hProperties as Record<string, unknown>),
              className: "pull-quote",
            },
          };
        }
      }
    });
  };
};
