import type { Root as HastRoot } from "hast";

/**
 * Creates a rehype plugin that converts the first element in the HTML tree to a span.
 * Useful for inline rendering of content that would normally be block-level,
 * such as when embedding processed markdown within other inline elements.
 *
 * @returns A rehype transformer function that converts the root element to a span
 *
 * @example
 * ```typescript
 * import { rehype } from 'rehype';
 *
 * const processor = rehype().use(rootAsSpan);
 * // Converts: <p>content</p> -> <span>content</span>
 * ```
 */
export function rootAsSpan() {
  return pluginFunction;
}

function pluginFunction(tree: HastRoot) {
  const firstChild = tree.children[0];

  if (firstChild && firstChild.type === "element") {
    firstChild.tagName = "span";
  }
}
