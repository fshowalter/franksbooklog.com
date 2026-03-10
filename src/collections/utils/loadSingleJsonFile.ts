import type { LoaderContext } from "astro/loaders";

import { promises as fs } from "node:fs";

import { watchFile } from "./watchFile";

/** Load a single JSON object file as one store entry with a fixed id. */
export function loadSingleJsonFile({
  filePath,
  id,
  loaderContext,
}: {
  filePath: string;
  id: string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const raw = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
      string,
      unknown
    >;
    const digest = loaderContext.generateDigest(raw);

    if (
      loaderContext.store.has(id) &&
      loaderContext.store.get(id)?.digest === digest
    ) {
      return;
    }

    const data = await loaderContext.parseData({ data: raw, id });
    loaderContext.store.set({ data, digest, id });
  };

  return watchFile(loaderContext, filePath, sync);
}
