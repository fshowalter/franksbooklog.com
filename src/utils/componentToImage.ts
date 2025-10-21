import type { Font } from "satori";

import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

import type { OpenGraphImageComponentType } from "~/components/open-graph-image/OpenGraphImage";
import type { AuthorOpenGraphImageComponentType } from "~/features/author-titles/AuthorTitlesOpenGraphImage";
import type { HomeOpenGraphImageComponentType } from "~/features/home/HomeOpenGraphImage";
import type { ReviewOpenGraphImageComponentType } from "~/features/review/ReviewOpenGraphImage";

import {
  createCacheConfig,
  createCacheKey,
  ensureCacheDir,
  getCachedItem,
  saveCachedItem,
} from "./cache";

const cacheConfig = createCacheConfig("og-images");

// Font data cache to avoid reading fonts multiple times
let fontDataCache: Font[] | undefined;

type OpenGraphImageComponent =
  | AuthorOpenGraphImageComponentType
  | HomeOpenGraphImageComponentType
  | OpenGraphImageComponentType
  | ReviewOpenGraphImageComponentType;

type ReactElementWithType = React.ReactElement & {
  $$typeof?: symbol;
  props: {
    [key: string]: unknown;
    children?: unknown;
  };
  type: string;
};

/**
 * Converts a React component to a JPEG image buffer for Open Graph images.
 * Uses caching in production to avoid regenerating identical images.
 *
 * @param component - The React component to convert to an image
 * @returns Promise resolving to JPEG image buffer
 */
export async function componentToImage(
  component: ReturnType<OpenGraphImageComponent>,
): Promise<Uint8Array<ArrayBuffer>> {
  // If caching is disabled, generate and return image directly
  if (!cacheConfig.enableCache) {
    const svg = await componentToSvg(component);
    return (await sharp(Buffer.from(svg))
      .jpeg()
      .toBuffer()) as Uint8Array<ArrayBuffer>;
  }

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

/**
 * Converts a React component to an SVG string using Satori.
 * Loads font data and renders the component at Open Graph image dimensions.
 *
 * @param component - The React component to convert to SVG
 * @returns Promise resolving to SVG string
 */
async function componentToSvg(component: ReturnType<OpenGraphImageComponent>) {
  const fonts = await getFontData();

  return await satori(component, {
    fonts,
    height: 630,
    width: 1200,
  });
}

/**
 * Loads and caches font data for Open Graph image rendering.
 * Reads TTF files and creates Font objects for use with Satori.
 * Uses in-memory caching to avoid repeated file system reads.
 *
 * @returns Promise resolving to array of Font objects
 */
async function getFontData() {
  if (fontDataCache) {
    return fontDataCache;
  }

  const [
    frankRuhlLibreExtraBold,
    frankRuhlLibreSemiBold,
    frankRuhlLibreRegular,
    assistantBold,
    assistantSemiBold,
  ] = await Promise.all([
    fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-ExtraBold.ttf",
    ),
    fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-SemiBold.ttf",
    ),
    fs.readFile("./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf"),
    fs.readFile("./public/fonts/Assistant/Assistant-Bold.ttf"),
    fs.readFile("./public/fonts/Assistant/Assistant-SemiBold.ttf"),
  ]);

  fontDataCache = [
    {
      data: frankRuhlLibreExtraBold.buffer,
      name: "FrankRuhlLibre",
      weight: 800,
    },
    {
      data: frankRuhlLibreSemiBold.buffer,
      name: "FrankRuhlLibre",
      weight: 600,
    },
    {
      data: frankRuhlLibreRegular.buffer,
      name: "FrankRuhlLibre",
      weight: 400,
    },
    {
      data: assistantBold.buffer,
      name: "Assistant",
      weight: 700,
    },
    {
      data: assistantSemiBold.buffer,
      name: "Assistant",
      weight: 600,
    },
  ];

  return fontDataCache;
}

/**
 * Serialize a JSX element to a stable string representation for hashing.
 * Simplified for OG image generation use case.
 * AIDEV-NOTE: This function is only used for OG image caching and handles
 * the specific JSX structures used in OG images (HTML elements, strings, arrays).
 */
function serializeJsx(element: React.JSX.Element): string {
  // Handle primitive values (strings, numbers, booleans)
  if (
    typeof element !== "object" ||
    element === null ||
    element === undefined
  ) {
    return JSON.stringify(element);
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return `[${element.map((item) => serializeJsx(item as React.JSX.Element)).join(",")}]`;
  }

  // Handle React elements
  const reactElement = element as ReactElementWithType;
  // For OG images, we only use string types (HTML elements)
  const typeName = reactElement.type;

  const props: Record<string, unknown> = {};

  // Process props, excluding children
  const elementProps = reactElement.props as Record<string, unknown>;
  for (const [key, value] of Object.entries(elementProps)) {
    if (key === "children") continue;

    // For OG images, we only have primitives and objects (style objects)
    // For objects and arrays (but not null), serialize as JSON
    props[key] =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : value; // Primitives (including null/undefined)
  }

  // Sort props for deterministic output
  // eslint-disable-next-line unicorn/no-array-sort
  const sortedPropsStr = JSON.stringify(props, Object.keys(props).sort());

  // Serialize children
  const children = reactElement.props?.children;
  const childrenStr = children
    ? serializeJsx(children as React.JSX.Element)
    : "";

  // Combine into a stable string representation
  return `<${typeName}:${sortedPropsStr}>${childrenStr}</${typeName}>`;
}
