import { markdownToHtml } from "satteri";

import { MARKDOWN_FEATURES } from "./features";
import { rootAsSpan } from "./plugins/rootAsSpan";
import { smartDashes } from "./plugins/smartDashes";

/**
 * Inline HTML pipeline — the first block becomes a `<span>` so the result can sit
 * inside an inline element. Used for readings' edition notes.
 */
export function renderInlineHtml(source: string): string {
  return markdownToHtml(source, {
    features: MARKDOWN_FEATURES,
    hastPlugins: [rootAsSpan],
    mdastPlugins: [smartDashes],
  }).html.trimEnd();
}
