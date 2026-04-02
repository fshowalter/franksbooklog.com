import { getImage } from "astro:assets";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export type CoverImageProps = {
  height: number;
  src: string;
  srcSet: string;
  width: number;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/covers/*.png",
);

export async function getFeedCoverProps(
  slug: string,
): Promise<CoverImageProps> {
  const titleCoverFile = await getTitleCoverFile(slug);

  const optimizedImage = await getImage({
    format: "jpeg",
    height: 750,
    quality: 80,
    src: titleCoverFile.default,
    width: 500,
  });

  return {
    height: 750,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width: 500,
  };
}

export async function getFixedCoverImageProps(
  slug: string,
  { width }: { width: number },
): Promise<CoverImageProps> {
  const titleCoverFile = await getTitleCoverFile(slug);
  const titleCoverPath = getTitleCoverPath(slug);

  const height = await getCoverHeight(titleCoverPath, width);

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height,
    quality: 80,
    src: titleCoverFile.default,
    width: width,
  });

  return {
    height,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width: width,
  };
}

export async function getFluidCoverImageProps(
  slug: string,
): Promise<CoverImageProps> {
  const width = 248;
  const titleCoverFile = await getTitleCoverFile(slug);
  const titleFilePath = getTitleCoverPath(slug);
  const height = await getCoverHeight(titleFilePath, width);

  const optimizedImage = await getImage({
    format: "avif",
    height,
    quality: 80,
    src: titleCoverFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
  });

  return {
    height,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width,
  };
}

export async function getStructuredDataCoverSrc(slug: string): Promise<string> {
  const titleCoverFile = await getTitleCoverFile(slug);

  const optimizedImage = await getImage({
    format: "jpeg",
    height: 750,
    quality: 80,
    src: titleCoverFile.default,
    width: 500,
  });

  return optimizedImage.src;
}

export async function getUpdateCoverProps(
  slug: string,
): Promise<CoverImageProps> {
  const coverFile = await getTitleCoverFile(slug);

  const coverFilePath = getTitleCoverPath(slug);
  const height = await getCoverHeight(coverFilePath, 500);

  const optimizedImage = await getImage({
    format: "png",
    height,
    quality: 100,
    src: coverFile.default,
    width: 500,
  });

  return {
    height,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width: 500,
  };
}

function coverPath(slug: string) {
  const coverPath = path.resolve(`./content/assets/covers/${slug}.png`);
  if (fs.existsSync(coverPath)) {
    return coverPath;
  }

  return;
}

async function getCoverHeight(coverPath: string, targetWidth: number) {
  try {
    const { height, width } = await sharp(coverPath).metadata();

    return (height / width) * targetWidth;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}

async function getTitleCoverFile(slug: string) {
  const coverKey = Object.keys(images).find((image) => {
    return image.endsWith(`${slug}.png`);
  });

  if (coverKey) {
    return await images[coverKey]();
  }

  const defaultCoverKey = Object.keys(images).find((image) => {
    return image.endsWith(`default.png`);
  })!;

  return await images[defaultCoverKey]();
}

function getTitleCoverPath(slug: string) {
  const titleCover = coverPath(slug);

  if (titleCover) {
    return titleCover;
  }

  return coverPath("default") || "";
}
