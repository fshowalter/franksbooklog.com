import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Configuration object for cache behavior and settings.
 * Defines cache directory, debugging options, and whether caching is enabled.
 */
type CacheConfig = {
  /** The directory path where cached items are stored */
  cacheDir: string;
  /** Whether to log cache hits and misses for debugging */
  debugCache?: boolean;
  /** Whether caching is enabled (disabled in development) */
  enableCache: boolean;
};

/**
 * Determines if caching should be enabled based on environment
 * - Disabled in development mode (DEV=true)
 * - Enabled in test mode (MODE=test) to test cache behavior
 * - Enabled in production builds
 */
const ENABLE_CACHE = (() => {
  // Enable caching in test mode to test cache behavior
  if (import.meta.env.MODE === "test") {
    return true;
  }
  // Disable in dev mode
  return !import.meta.env.DEV;
})();

/**
 * Creates a cache configuration object for a specific cache namespace
 *
 * @param name - The name/namespace for this cache
 * @returns Cache configuration object
 */
export function createCacheConfig(name: string): CacheConfig {
  return {
    cacheDir: path.join(process.cwd(), ".cache", name),
    debugCache: process.env.DEBUG_CACHE === "true",
    enableCache: ENABLE_CACHE,
  };
}

/**
 * Creates a SHA256 hash to use as a cache key
 *
 * @param data - The data to hash for caching
 * @returns Hexadecimal hash string for use as cache key
 */
export function createCacheKey(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Ensures the cache directory exists, creating it recursively if needed
 *
 * @param cacheDir - The cache directory path to create
 */
export async function ensureCacheDir(cacheDir: string): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true });
}

/**
 * Retrieves an item from the cache if it exists.
 * Supports both text and binary cache items with optional debug logging.
 *
 * @param cacheDir - The cache directory path
 * @param cacheKey - The cache key (typically a hash)
 * @param extension - File extension for the cached item
 * @param binary - Whether the cached item is binary data (default: false)
 * @param debugCache - Enable debug logging for cache hits/misses
 * @param debugMessage - Custom message for debug logging
 * @returns Promise resolving to cached item or undefined if not found
 */
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

/**
 * Saves an item to the cache with automatic directory creation.
 * Supports both text and binary content types.
 *
 * @param cacheDir - The cache directory path
 * @param cacheKey - The cache key (typically a hash)
 * @param extension - File extension for the cached item
 * @param content - The content to cache (string or binary data)
 * @returns Promise that resolves when item is saved
 */
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

/**
 * Generates the file system path for a cached item.
 * Uses the first 2 characters of the cache key to create subdirectories
 * for better file system performance with large numbers of cached items.
 *
 * @param cacheDir - The cache directory path
 * @param cacheKey - The cache key (typically a hash)
 * @param extension - File extension for the cached item
 * @returns Full file path for the cached item
 */
function getCachePath(
  cacheDir: string,
  cacheKey: string,
  extension: string,
): string {
  const subDir = cacheKey.slice(0, 2);
  return path.join(cacheDir, subDir, `${cacheKey}.${extension}`);
}
