import { getImage } from "astro:assets";
import { toSentenceArray } from "src/utils";

import { allWorksJson, type WorkJson } from "./data/worksJson";
import { normalizeSources } from "./utils/normalizeSources";

export interface CoverImageProps {
  src: string;
  srcSet: string;
  alt: string;
}

interface Work {
  slug: string;
  includedInSlugs: string[];
}

let cachedWorksJson: WorkJson[] | null = null;

if (import.meta.env.MODE !== "development") {
  cachedWorksJson = await allWorksJson();
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/covers/*.png",
);

function altTextForWorkJson(workJson: WorkJson) {
  const title = workJson.subtitle
    ? `${workJson.title}: ${workJson.subtitle}`
    : workJson.title;

  const authors = toSentenceArray(
    workJson.authors.map((author) => {
      return author.notes ? `${author.name} (${author.notes})` : author.name;
    }),
  ).join("");

  return `A cover for ${title} by ${authors}`;
}

function parentCoverForWork(work: Work, worksJson: WorkJson[]) {
  let parentWorkCoverPath: string | undefined;

  const parentSlug = work.includedInSlugs.find((slug) => {
    parentWorkCoverPath = Object.keys(images).find((image) => {
      return image.endsWith(`${slug}.png`);
    });

    return parentWorkCoverPath ? slug : parentWorkCoverPath;
  });

  if (parentSlug && parentWorkCoverPath) {
    const parentWork = worksJson.find((work) => work.slug === parentSlug)!;
    return {
      workCoverPath: parentWorkCoverPath,
      altText: altTextForWorkJson(parentWork),
    };
  } else {
    const defaultWorkCoverPath = Object.keys(images).find((image) => {
      return image.endsWith(`default.png`);
    })!;

    return {
      workCoverPath: defaultWorkCoverPath,
      altText: "A blank cover.",
    };
  }
}

async function getWorkCoverFileAndAltText(work: Work) {
  const worksJson = cachedWorksJson || (await allWorksJson());

  let workCoverPath = Object.keys(images).find((path) => {
    return path.endsWith(`${work.slug}.png`);
  });

  let altText: string;

  if (workCoverPath) {
    altText = altTextForWorkJson(
      worksJson.find((workJson) => {
        return workJson.slug === work.slug;
      })!,
    );
  } else {
    ({ workCoverPath, altText } = parentCoverForWork(work, worksJson));
  }

  const workCoverFile = await images[workCoverPath]();

  return {
    workCoverFile,
    altText,
  };
}

export async function getOpenGraphCoverSrc(work: Work): Promise<string> {
  const { workCoverFile } = await getWorkCoverFileAndAltText(work);

  const optimizedImage = await getImage({
    src: workCoverFile.default,
    width: 1200,
    height: 630,
    format: "jpeg",
    quality: 80,
  });

  return normalizeSources(optimizedImage.src);
}

export async function getFeedCoverProps(work: Work): Promise<CoverImageProps> {
  const { workCoverFile, altText } = await getWorkCoverFileAndAltText(work);

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
    alt: altText,
  };
}

export async function getFluidCoverImageProps(
  work: Work,
  { width, height }: { width: number; height: number },
): Promise<CoverImageProps> {
  const { workCoverFile, altText } = await getWorkCoverFileAndAltText(work);

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
    alt: altText,
  };
}

export async function getFixedCoverImageProps(
  work: Work,
  { width, height }: { width: number; height: number },
): Promise<CoverImageProps> {
  const { workCoverFile, altText } = await getWorkCoverFileAndAltText(work);

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
    alt: altText,
  };
}
