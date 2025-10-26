import type { Root, RootContent } from "mdast";

/**
 * Remark plugin that trims markdown content to create excerpts.
 * Removes all content after the first paragraph, effectively creating
 * a summary or excerpt from the full markdown content.
 *
 * @returns Remark transformer function that modifies the AST
 */
export function trimToExcerpt() {
  return pluginFunction;
}

function pluginFunction(tree: Root) {
  const separatorIndex = tree.children.findIndex((node: RootContent) => {
    return node.type === "paragraph";
  });

  if (separatorIndex !== -1) {
    tree.children.splice(separatorIndex + 1);
  }
}
