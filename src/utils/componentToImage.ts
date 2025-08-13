import type { JSX } from "react";
import type { Font } from "satori";

import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

import {
  createCacheConfig,
  createCacheKey,
  ensureCacheDir,
  getCachedItem,
  saveCachedItem,
} from "./cache";
import { serializeJsx } from "./serializeJsx";

const cacheConfig = createCacheConfig("og-images");

// Font data cache to avoid reading fonts multiple times
let fontDataCache: Font[] | undefined;

export async function componentToImage(
  component: JSX.Element,
): Promise<Uint8Array<ArrayBuffer>> {
  if (cacheConfig.enableCache) {
    await ensureCacheDir(cacheConfig.cacheDir);

    // Serialize the component to create a stable cache key
    const serialized = serializeJsx(component);
    const cacheKey = createCacheKey(serialized);

    // Check for cached image
    const cachedImage = await getCachedItem<Uint8Array<ArrayBuffer>>(
      cacheConfig.cacheDir,
      cacheKey,
      "jpg",
      true,
      cacheConfig.debugCache,
      `OG Image: ${cacheKey.slice(0, 8)}...`,
    );

    if (cachedImage) {
      return cachedImage;
    }

    if (process.env.DEBUG_CACHE_VERBOSE === "true") {
      console.log(`[CACHE] Serialized length: ${serialized.length}`);
      console.log(`[CACHE] Serialized preview: ${serialized.slice(0, 200)}...`);
    }

    // Generate the SVG (expensive operation)
    const svg = await componentToSvg(component);

    // Convert SVG to JPEG
    const imageBuffer = (await sharp(Buffer.from(svg))
      .jpeg()
      .toBuffer()) as Uint8Array<ArrayBuffer>;

    // Save to cache
    await saveCachedItem(cacheConfig.cacheDir, cacheKey, "jpg", imageBuffer);

    return imageBuffer;
  }

  // No caching - generate SVG and convert to JPEG
  const svg = await componentToSvg(component);
  return (await sharp(Buffer.from(svg))
    .jpeg()
    .toBuffer()) as Uint8Array<ArrayBuffer>;
}

async function componentToSvg(component: JSX.Element) {
  const fonts = await getFontData();

  return await satori(component, {
    fonts,
    height: 630,
    width: 1200,
  });
}

async function getFontData() {
  if (fontDataCache) {
    return fontDataCache;
  }

  const [frankRuhlLibre, argentumSansRegular, argentumSansSemiBold] =
    await Promise.all([
      fs.readFile(
        "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf",
      ),
      fs.readFile("./public/fonts/ArgentumSans/ArgentumSans-Regular.ttf"),
      fs.readFile("./public/fonts/ArgentumSans/ArgentumSans-SemiBold.ttf"),
    ]);

  fontDataCache = [
    {
      data: frankRuhlLibre.buffer as ArrayBuffer,
      name: "FrankRuhlLibre",
      weight: 400,
    },
    {
      data: argentumSansRegular.buffer as ArrayBuffer,
      name: "ArgentumSans",
      weight: 400,
    },
    {
      data: argentumSansSemiBold.buffer as ArrayBuffer,
      name: "ArgentumSans",
      weight: 600,
    },
  ];

  return fontDataCache;
}
