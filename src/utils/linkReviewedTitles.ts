import { getCollection } from "astro:content";

let titleIdToSlugCache: Record<string, string | undefined>;

const re = new RegExp(/(<span data-title-id="(tt\d+)">)(.*?)(<\/span>)/, "g");

export async function linkReviewedTitles(text: string | undefined) {
  if (!text) {
    return text;
  }

  let result = text;

  const matches = [...text.matchAll(re)];

  const cache = await getTitleIdToSlugCache();

  for (const match of matches) {
    const matchingSlug = cache[match[2]];

    if (matchingSlug) {
      result = result.replace(
        `<span data-title-id="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${matchingSlug}/">${match[3]}</a>`,
      );
    } else {
      if (match[3]) {
        result = result.replace(
          `<span data-title-id="${match[2]}">${match[3]}</span>`,
          match[3],
        );
      }
    }
  }

  return result;
}

async function getTitleIdToSlugCache(): Promise<
  Record<string, string | undefined>
> {
  if (titleIdToSlugCache) {
    return titleIdToSlugCache;
  }

  const cache: Record<string, string | undefined> = {};

  const reviewedTitles = await getCollection("reviewedTitles");

  for (const { data: title } of reviewedTitles) {
    cache[title.id] = title.review.id;
  }

  titleIdToSlugCache = cache;

  return titleIdToSlugCache;
}
