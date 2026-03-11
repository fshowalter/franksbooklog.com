import type { LoaderContext } from "astro/loaders";

import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

import { watchDirectory } from "./watchDirectory";

/** Load a directory of Markdown files, one entry per file.
 *  getId derives the entry ID cheaply (no I/O); buildData runs the remark/rehype
 *  pipeline and is only called when the digest shows the file has changed. */
export function loadMarkdownDirectory({
  buildData,
  directoryPath,
  loaderContext,
}: {
  buildData: (opts: {
    body: string;
    frontmatter: Record<string, unknown>;
    id: string;
  }) => Record<string, unknown>;
  directoryPath: string;
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
      const id = path.parse(filePath).name;
      newIds.add(id);

      // Digest raw content to skip expensive remark/rehype re-processing
      const digest = loaderContext.generateDigest(fileContents);

      if (
        loaderContext.store.has(id) &&
        loaderContext.store.get(id)?.digest === digest
      ) {
        continue;
      }

      const { content: body, data: frontmatter } = matter(fileContents);

      // buildData runs remark/rehype WITHOUT linkReviewedWorks (applied in API layer)
      const data = await loaderContext.parseData({
        data: buildData({ body, frontmatter, id }),
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
