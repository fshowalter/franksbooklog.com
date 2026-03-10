import type { LoaderContext } from "astro/loaders";

/** Run sync() immediately, then re-run it whenever filePath changes. */
export async function watchFile(
  loaderContext: LoaderContext,
  filePath: string,
  sync: () => Promise<void>,
): Promise<void> {
  await sync();
  loaderContext.watcher?.add(filePath);
  loaderContext.watcher?.on("change", (changedPath) => {
    if (changedPath === filePath) void sync();
  });
}
