import type { LoaderContext } from "astro/loaders";

import { promises as fs } from "node:fs";
import path from "node:path";

import { watchDirectory } from "./watchDirectory";

export function loadJsonSplitFile({
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

    for (const file of jsonFiles) {
      const rawItems = JSON.parse(
        await fs.readFile(path.resolve(directoryPath, file.name), "utf8"),
      ) as Record<string, unknown>[];

      for (const raw of rawItems) {
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
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) loaderContext.store.delete(id);
    }
  };

  return watchDirectory(loaderContext, directoryPath, sync);
}
