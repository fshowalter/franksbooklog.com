import type { Root, RootContent } from "mdast";

export function trimToExcerpt() {
  return (tree: Root) => {
    const separatorIndex = tree.children.findIndex((node: RootContent) => {
      return node.type === "paragraph";
    });

    if (separatorIndex !== -1) {
      tree.children.splice(separatorIndex + 1);
    }
  };
}
