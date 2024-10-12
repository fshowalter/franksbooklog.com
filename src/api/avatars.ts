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

function avatarPath(slug: string) {
  const avatarPath = path.resolve(`./content/assets/avatars/${slug}.png`);
  if (fs.existsSync(avatarPath)) {
    return avatarPath;
  }

  return;
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

  const defaultAvatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#fafafa" width="100%"><path clip-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z" fill-rule="evenodd" /></svg>`;

  const imageBuffer = await sharp(Buffer.from(defaultAvatar))
    .resize(250)
    .toFormat("png")
    .toBuffer();

  return `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;
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
