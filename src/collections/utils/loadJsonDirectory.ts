import type { LoaderContext } from "astro/loaders";

import { promises as fs } from "node:fs";
import path from "node:path";

import { watchDirectory } from "./watchDirectory";

/** Load a directory of JSON files, one entry per file. */
export function loadJsonDirectory({
  directoryPath,
  getId = (raw) => raw.id as string,
  loaderContext,
}: {
  directoryPath: string;
  getId?: (raw: Record<string, unknown>) => string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const jsonFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".json"),
    );
    const newIds = new Set<string>();

    for (const entry of jsonFiles) {
      const filePath = path.join(directoryPath, entry.name);
      const raw = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
        string,
        unknown
      >;
      const id = getId(raw);
      newIds.add(id);

      const digest = loaderContext.generateDigest(raw);
      if (
        loaderContext.store.has(id) &&
        loaderContext.store.get(id)?.digest === digest
      ) {
        continue;
      }

      const data = await loaderContext.parseData({ data: raw, id });
      loaderContext.store.set({ data, digest, id });
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) loaderContext.store.delete(id);
    }
  };

  return watchDirectory(loaderContext, directoryPath, sync);
}
