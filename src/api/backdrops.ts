import { getImage } from "astro:assets";
import path from "node:path";
import sharp from "sharp";

import { normalizeSources } from "./utils/normalizeSources";

/**
 * Type representing optimized backdrop image properties for display.
 * Contains source URL and responsive srcSet for different screen widths.
 */
export type BackdropImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/backdrops/*.png",
);

/**
 * Retrieves optimized backdrop image properties for a given work slug.
 * Processes the backdrop image with Astro's image optimization pipeline,
 * generating responsive images in AVIF format with multiple widths for different screen sizes.
 *
 * @param slug - The work's unique slug identifier
 * @param dimensions - Target dimensions for the backdrop image
 * @param dimensions.height - Target height in pixels
 * @param dimensions.width - Target width in pixels
 * @returns Promise resolving to backdrop image properties with responsive srcSet
 *
 * @example
 * ```typescript
 * const backdropProps = await getBackdropImageProps('work-slug', { width: 1200, height: 600 });
 * console.log(backdropProps.src); // Optimized image URL
 * console.log(backdropProps.srcSet); // Responsive srcSet with multiple widths
 * ```
 */
export async function getBackdropImageProps(
  slug: string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<BackdropImageProps> {
  const backdropFile = await getBackdropFile(slug);

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: backdropFile.default,
    width: width,
    widths: [0.3, 0.5, 0.8, 1].map((w) => w * width),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

/**
 * Generates a base64-encoded backdrop image for Open Graph meta tags.
 * Processes the backdrop with Sharp to create a 1200px wide PNG suitable for
 * social media previews and Open Graph sharing.
 *
 * @param slug - The work's unique slug identifier
 * @returns Promise resolving to base64 data URL string
 *
 * @example
 * ```typescript
 * const base64Backdrop = await getOpenGraphBackdropAsBase64String('work-slug');
 * // Use in OpenGraph meta tag: <meta property="og:image" content={base64Backdrop} />
 * ```
 */
export async function getOpenGraphBackdropAsBase64String(slug: string) {
  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/${slug}.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  return `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;
}

/**
 * Internal function to load backdrop file metadata using Vite's glob imports.
 * Searches through the imported backdrop files to find a matching slug.
 *
 * @param slug - The work's unique slug identifier
 * @returns Promise resolving to image metadata
 */
async function getBackdropFile(slug: string) {
  const backdropFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  })!;

  return await images[backdropFilePath]();
}
