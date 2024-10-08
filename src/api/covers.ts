import fs from "node:fs";
import path from "node:path";

import { getImage } from "astro:assets";
import sharp from "sharp";

import { normalizeSources } from "./utils/normalizeSources";

export interface CoverImageProps {
  src: string;
  srcSet: string;
}

interface Work {
  slug: string;
  includedInSlugs: string[];
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/covers/*.png",
);

export async function getStructuredDataCoverSrc(work: Work): Promise<string> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    src: workCoverFile.default,
    width: 500,
    height: 750,
    format: "jpeg",
    quality: 80,
  });

  return normalizeSources(optimizedImage.src);
}

export async function getOpenGraphCoverAsBase64String(work: Work) {
  const imageBuffer = await sharp(getWorkCoverPath(work))
    .resize(420)
    .toFormat("png")
    .toBuffer();

  return `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;
}

function coverPath(slug: string) {
  const coverPath = path.resolve(`./content/assets/covers/${slug}.png`);
  if (fs.existsSync(coverPath)) {
    return coverPath;
  }

  return null;
}

function getWorkCoverPath(work: Work) {
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

export async function getFeedCoverProps(work: Work): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    src: workCoverFile.default,
    width: 500,
    height: 750,
    format: "jpeg",
    quality: 80,
  });

  return {
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    src: normalizeSources(optimizedImage.src),
  };
}

export async function getFluidCoverImageProps(
  work: Work,
  { width, height }: { width: number; height: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    src: workCoverFile.default,
    width: width,
    height: height,
    format: "avif",
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
    quality: 80,
  });

  return {
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    src: normalizeSources(optimizedImage.src),
  };
}

export async function getFixedCoverImageProps(
  work: Work,
  { width, height }: { width: number; height: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    src: workCoverFile.default,
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
