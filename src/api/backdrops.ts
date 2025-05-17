import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export type BackdropImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/backdrops/*.png",
);

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

async function getBackdropFile(slug: string) {
  let backdropFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  })!;

  backdropFilePath =
    backdropFilePath ||
    Object.keys(images).find((path) => {
      return path.endsWith(`default.png`);
    })!;

  return await images[backdropFilePath]();
}
