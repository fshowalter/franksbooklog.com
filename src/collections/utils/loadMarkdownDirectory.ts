import type { LoaderContext } from "astro/loaders";

import { parseFrontmatter } from "markdown-utils";
import { promises as fs } from "node:fs";
import path from "node:path";

import { watchDirectory } from "./watchDirectory";

/** Load a directory of Markdown files, one entry per file.
 *  getId derives the entry ID cheaply (no I/O); buildData renders the markdown
 *  and is only called when the digest shows the file has changed.
 *
 *  buildData receives the whole file as `source` — Sätteri skips the frontmatter
 *  block when rendering, so there is no separate body to pass. */
export function loadMarkdownDirectory({
  buildData,
  directoryPath,
  getId,
  loaderContext,
}: {
  buildData: (opts: {
    frontmatter: Record<string, unknown>;
    id: string;
    source: string;
  }) => Record<string, unknown>;
  directoryPath: string;
  getId?: (raw: string, filePath: string) => string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const mdFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".md"),
    );
    const newIds = new Set<string>();

    for (const entry of mdFiles) {
      const filePath = path.join(directoryPath, entry.name);
      const fileContents = await fs.readFile(filePath, "utf8");

      const id = getId
        ? getId(fileContents, filePath)
        : path.parse(filePath).name;
      newIds.add(id);

      // Digest raw content to skip re-rendering unchanged files
      const digest = loaderContext.generateDigest(fileContents);

      if (
        loaderContext.store.has(id) &&
        loaderContext.store.get(id)?.digest === digest
      ) {
        continue;
      }

      const frontmatter = parseFrontmatter(fileContents, filePath);

      // buildData renders WITHOUT linkReviewedTitles (applied in the render layer)
      const data = await loaderContext.parseData({
        data: buildData({ frontmatter, id, source: fileContents }),
        id,
      });
      loaderContext.store.set({ data, digest, id });
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) {
        loaderContext.store.delete(id);
      }
    }
  };

  return watchDirectory(loaderContext, directoryPath, sync);
}
