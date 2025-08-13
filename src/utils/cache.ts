import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

type CacheConfig = {
  cacheDir: string;
  debugCache?: boolean;
  enableCache: boolean;
};

export function createCacheConfig(
  name: string,
  isTest: boolean = import.meta.env.MODE === "test",
  isDev: boolean = import.meta.env.DEV,
): CacheConfig {
  return {
    cacheDir: isTest
      ? path.join(tmpdir(), `${name}-test-cache`)
      : path.join(process.cwd(), ".cache", name),
    debugCache: process.env.DEBUG_CACHE === "true",
    enableCache: !isDev,
  };
}

export function createCacheKey(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function ensureCacheDir(cacheDir: string): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true });
}

export async function getCachedItem<T = string>(
  cacheDir: string,
  cacheKey: string,
  extension: string,
  binary: boolean = false,
  debugCache?: boolean,
  debugMessage?: string,
): Promise<T | undefined> {
  const cachePath = getCachePath(cacheDir, cacheKey, extension);

  try {
    const result = binary
      ? ((await fs.readFile(cachePath)) as T)
      : ((await fs.readFile(cachePath, "utf8")) as T);

    if (debugCache && debugMessage) {
      console.log(`[CACHE HIT] ${debugMessage}`);
    }

    return result;
  } catch {
    if (debugCache && debugMessage) {
      console.log(`[CACHE MISS] ${debugMessage}`);
    }
    return undefined;
  }
}

export async function saveCachedItem(
  cacheDir: string,
  cacheKey: string,
  extension: string,
  content: string | Uint8Array<ArrayBuffer>,
): Promise<void> {
  const cachePath = getCachePath(cacheDir, cacheKey, extension);
  const cacheSubDir = path.dirname(cachePath);

  await fs.mkdir(cacheSubDir, { recursive: true });

  await (typeof content === "string"
    ? fs.writeFile(cachePath, content, "utf8")
    : fs.writeFile(cachePath, content));
}

function getCachePath(
  cacheDir: string,
  cacheKey: string,
  extension: string,
): string {
  const subDir = cacheKey.slice(0, 2);
  return path.join(cacheDir, subDir, `${cacheKey}.${extension}`);
}
