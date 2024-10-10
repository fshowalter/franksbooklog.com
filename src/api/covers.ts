import { getImage } from "astro:assets";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { normalizeSources } from "./utils/normalizeSources";

export type CoverImageProps = {
  src: string;
  srcSet: string;
};

type Work = {
  includedInSlugs: string[];
  slug: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/covers/*.png",
);

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
    format: "jpeg",
    height: 750,
    quality: 80,
    src: workCoverFile.default,
    width: 500,
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

export async function getFluidCoverImageProps(
  work: Work,
  { height, width }: { height: number; width: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: workCoverFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

export async function getFixedCoverImageProps(
  work: Work,
  { height, width }: { height: number; width: number },
): Promise<CoverImageProps> {
  const workCoverFile = await getWorkCoverFile(work);

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height: height,
    quality: 80,
    src: workCoverFile.default,
    width: width,
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}
