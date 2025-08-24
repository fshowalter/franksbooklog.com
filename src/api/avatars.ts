import { getImage } from "astro:assets";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { normalizeSources } from "./utils/normalizeSources";

export type AvatarImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

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
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

export async function getOpenGraphAvatarAsBase64String(slug: string) {
  const avatar = avatarPath(slug);

  if (avatar) {
    const imageBuffer = await sharp(avatar)
      .resize(250)
      .toFormat("png")
      .toBuffer();

    return `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;
  }

  return;
}

function avatarPath(slug: string) {
  const avatarPath = path.resolve(`./content/assets/avatars/${slug}.png`);
  if (fs.existsSync(avatarPath)) {
    return avatarPath;
  }

  return;
}

async function getAvatarFile(slug: string) {
  const imagePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!imagePath) {
    return;
  }

  return await images[imagePath]();
}
