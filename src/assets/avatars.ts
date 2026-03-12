import { getImage } from "astro:assets";

/**
 * Type representing optimized avatar image properties for display.
 * Contains source URL and responsive srcSet for different screen densities.
 */
export type AvatarImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

/**
 * Retrieves optimized avatar image properties for a given author slug.
 * Processes the avatar image with Astro's image optimization pipeline,
 * generating responsive images in AVIF format with multiple densities.
 *
 * @param slug - The author's unique slug identifier
 * @param dimensions - Target dimensions for the avatar image
 * @param dimensions.height - Target height in pixels
 * @param dimensions.width - Target width in pixels
 * @returns Promise resolving to avatar image properties, or undefined if no avatar exists
 *
 * @example
 * ```typescript
 * const avatarProps = await getAvatarImageProps('author-slug', { width: 100, height: 100 });
 * if (avatarProps) {
 *   console.log(avatarProps.src); // Optimized image URL
 *   console.log(avatarProps.srcSet); // Responsive srcSet attribute
 * }
 * ```
 */
export async function getAvatarImageProps(
  slug: string,
  { height, width }: { height: number; width: number },
): Promise<AvatarImageProps | undefined> {
  const avatarFile = await getAvatarFile(slug);

  if (!avatarFile) {
    return;
  }

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height: height,
    quality: 80,
    src: avatarFile.default,
    width: width,
  });

  return {
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
  };
}

/**
 * Internal function to load avatar file metadata using Vite's glob imports.
 * Searches through the imported avatar files to find a matching slug.
 *
 * @param slug - The author's unique slug identifier
 * @returns Promise resolving to image metadata, or undefined if not found
 */
async function getAvatarFile(slug: string) {
  const imagePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!imagePath) {
    return;
  }

  return await images[imagePath]();
}
