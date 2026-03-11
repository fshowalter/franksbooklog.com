import type { Node, Parent } from "mdast";

import { CONTINUE, SKIP, visit } from "unist-util-visit";

/**
 * Creates a remark plugin that removes footnote references from markdown AST.
 * Used to clean up content for excerpts or situations where footnotes
 * should not be displayed.
 *
 * @returns A remark transformer function that removes footnote references
 *
 * @example
 * ```typescript
 * import { remark } from 'remark';
 *
 * const processor = remark().use(removeFootnotes);
 * const result = processor.processSync('Text with footnote[^1]');
 * // Result will have footnote reference removed
 * ```
 */
export function removeFootnotes() {
  return pluginFunction;
}

function pluginFunction(tree: Node) {
  visit(
    tree,
    "footnoteReference",
    function (
      node: Node,
      index: number | undefined,
      parent: Parent | undefined,
    ) {
      if (parent && index && node.type === "footnoteReference") {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
      return CONTINUE;
    },
  );

  return tree;
}
