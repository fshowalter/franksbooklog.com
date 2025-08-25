import type { IFS } from "unionfs";

import { fs as memFs, vol } from "memfs";
import realFs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Union } from "unionfs";
import { beforeEach, vi } from "vitest";

// Create a union filesystem that overlays memfs on top of the real filesystem
// This allows cache operations to go to memory while other operations go to disk
const ufs = new Union();

// Add real filesystem first (lower priority)
ufs.use(realFs);

// Add memfs second (higher priority - will override real fs for matching paths)

ufs.use(memFs as unknown as IFS);

// Create promise versions of the unionfs methods
type AsyncFn<T extends unknown[], R> = (...args: T) => Promise<R>;
type CallbackFn<T extends unknown[], R> = (
  ...args: [...T, (err: Error | null, result?: R) => void]
) => void;

const promisify = <T extends unknown[], R>(
  fn: CallbackFn<T, R>,
): AsyncFn<T, R> => {
  return (...args: T) =>
    new Promise((resolve, reject) => {
      fn(...args, (err: Error | null, result?: R) => {
        if (err) reject(err);
        else resolve(result as R);
      });
    });
};

// Mock node:fs/promises to use our union filesystem
vi.mock("node:fs/promises", () => {
  return {
    access: promisify(ufs.access.bind(ufs)),
    default: {
      access: promisify(ufs.access.bind(ufs)),
      mkdir: promisify(ufs.mkdir.bind(ufs)),
      readdir: promisify(ufs.readdir.bind(ufs)),
      readFile: promisify(ufs.readFile.bind(ufs)),
      rmdir: promisify(ufs.rmdir.bind(ufs)),
      stat: promisify(ufs.stat.bind(ufs)),
      unlink: promisify(ufs.unlink.bind(ufs)),
      writeFile: promisify(ufs.writeFile.bind(ufs)),
    },
    mkdir: promisify(ufs.mkdir.bind(ufs)),
    readdir: promisify(ufs.readdir.bind(ufs)),
    readFile: promisify(ufs.readFile.bind(ufs)),
    rmdir: promisify(ufs.rmdir.bind(ufs)),
    stat: promisify(ufs.stat.bind(ufs)),
    unlink: promisify(ufs.unlink.bind(ufs)),
    writeFile: promisify(ufs.writeFile.bind(ufs)),
  };
});

// AIDEV-NOTE: Mock createCacheConfig to use a test-specific directory
// This ensures tests never read from the real .cache directory
vi.mock("./src/utils/cache", async () => {
  const actual = await vi.importActual("./src/utils/cache");

  // Generate a unique test cache directory per test run
  const testCacheRoot = path.join(
    tmpdir(),
    "test-cache",
    process.pid.toString(),
  );

  return {
    ...actual,
    createCacheConfig: (name: string) => ({
      cacheDir: path.join(testCacheRoot, name),
      debugCache: process.env.DEBUG_CACHE === "true",
      enableCache: actual.ENABLE_CACHE,
    }),
  };
});

// Reset memfs volume before each test to clean cache
beforeEach(() => {
  vol.reset();
  // Pre-create the temp directory structure for cache
  const tempDir = tmpdir();
  vol.mkdirSync(tempDir, { recursive: true });
});
