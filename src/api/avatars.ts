import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export interface AvatarImageProps {
  src: string;
  srcSet: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

async function getAvatarFile(slug: string) {
  const imagePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!imagePath) {
    return null;
  }

  return await images[imagePath]();
}

export async function getAvatarImageProps(
  slug: string,
  { width, height }: { width: number; height: number },
): Promise<AvatarImageProps | null> {
  const avatarFile = await getAvatarFile(slug);

  if (!avatarFile) {
    return null;
  }

  const optimizedImage = await getImage({
    src: avatarFile.default,
    width: width,
    height: height,
    format: "avif",
    densities: [1, 2],
    quality: 80,
  });

  return {
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    src: normalizeSources(optimizedImage.src),
  };
}
