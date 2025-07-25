import { getImage } from "astro:assets";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { normalizeSources } from "./utils/normalizeSources";

export type CoverImageProps = {
  height: number;
  src: string;
  srcSet: string;
  width: number;
};

type Work = {
  includedInSlugs: string[];
  slug: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/covers/*.png",
);

export async function getCoverHeight(coverPath: string, targetWidth: number) {
  try {
    const { height, width } = await sharp(coverPath).metadata();

    return (height / width) * targetWidth;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}

export async function getCoverWidth(work: Work, targetHeight: number) {
  try {
    const coverPath = getWorkCoverPath(work);
    const { height, width } = await sharp(coverPath).metadata();

    return (width / height) * targetHeight;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}

export async function getFeedCoverProps(work: Work): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    format: "jpeg",
    height: 750,
    quality: 80,
    src: workCoverFile.default,
    width: 500,
  });

  return {
    height: 750,
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    width: 500,
  };
}

export async function getFixedCoverImageProps(
  work: Work,
  { width }: { width: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);
  const workCoverPath = getWorkCoverPath(work);

  const height = await getCoverHeight(workCoverPath, width);

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height,
    quality: 80,
    src: workCoverFile.default,
    width: width,
  });

  return {
    height,
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    width: width,
  };
}

export async function getFluidCoverImageProps(
  work: Work,
  { width }: { width: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);
  const coverFilePath = getWorkCoverPath(work);
  const height = await getCoverHeight(coverFilePath, width);

  const optimizedImage = await getImage({
    format: "avif",
    height,
    quality: 80,
    src: workCoverFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
  });

  return {
    height,
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    width,
  };
}

export async function getOpenGraphCoverAsBase64String(work: Work) {
  const imageBuffer = await sharp(getWorkCoverPath(work))
    .resize(420)
    .toFormat("png")
    .toBuffer();

  return `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;
}

export async function getStructuredDataCoverSrc(work: Work): Promise<string> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    format: "jpeg",
    height: 750,
    quality: 80,
    src: workCoverFile.default,
    width: 500,
  });

  return normalizeSources(optimizedImage.src);
}

export async function getUpdateCoverProps(
  work: Work,
): Promise<CoverImageProps> {
  const coverFile = await getWorkCoverFile(work);

  const coverFilePath = getWorkCoverPath(work);
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
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    width: 500,
  };
}

export function getWorkCoverPath(work: Work) {
  const workCover = coverPath(work.slug);

  if (workCover) {
    return workCover;
  }

  let parentCover;

  for (const includedInSlug of work.includedInSlugs) {
    parentCover = coverPath(includedInSlug);

    if (parentCover) {
      break;
    }
  }

  if (parentCover) {
    return parentCover;
  }

  return coverPath("default") || "";
}

function coverPath(slug: string) {
  const coverPath = path.resolve(`./content/assets/covers/${slug}.png`);
  if (fs.existsSync(coverPath)) {
    return coverPath;
  }

  return;
}

async function getWorkCoverFile(work: Work) {
  const workSlug = work.slug;

  const coverKey = Object.keys(images).find((image) => {
    return image.endsWith(`${workSlug}.png`);
  });

  if (coverKey) {
    return await images[coverKey]();
  }

  let parentCoverKey;

  for (const includedInSlug of work.includedInSlugs) {
    parentCoverKey = Object.keys(images).find((image) => {
      return image.endsWith(`${includedInSlug}.png`);
    });

    if (parentCoverKey) {
      break;
    }
  }

  if (parentCoverKey) {
    return await images[parentCoverKey]();
  }

  const defaultWorkCoverKey = Object.keys(images).find((image) => {
    return image.endsWith(`default.png`);
  })!;

  return await images[defaultWorkCoverKey]();
}
