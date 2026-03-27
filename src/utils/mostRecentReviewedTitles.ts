import { getCollection } from "astro:content";

export async function mostRecentReviewedTitles(limit: number) {
  const reviewedTitles = await getCollection("reviewedTitles");

  reviewedTitles.sort((a, b) => {
    return b.data.reviewSequence.localeCompare(a.data.reviewSequence);
  });

  return reviewedTitles.slice(0, limit);
}
