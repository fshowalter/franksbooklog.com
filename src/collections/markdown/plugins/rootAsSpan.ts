import { defineHastPlugin } from "satteri";

/**
 * Retags the document's first paragraph as a `<span>` so it can be embedded in an
 * inline context. Later blocks keep their `<p>`.
 *
 * AIDEV-NOTE: `ctx.setProperty(node, "tagName", …)` does NOT work here — for hast
 * it writes into `properties`, emitting a literal `<p tagName="span">`. Returning
 * a replacement node is the supported way to change an element's tag.
 */
export const rootAsSpan = defineHastPlugin({
  element: {
    filter: ["p"],
    visit(node, ctx) {
      if (ctx.parent(node)?.type !== "root" || ctx.indexOf(node) !== 0) {
        return;
      }

      return {
        children: [...node.children],
        properties: node.properties,
        tagName: "span",
        type: "element",
      };
    },
  },
  name: "root-as-span",
});
