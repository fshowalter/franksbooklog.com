import { getCollection } from "astro:content";

export async function mostRecentReviewedWorks(limit: number) {
  const reviewedWorks = await getCollection("reviewedWorks");

  reviewedWorks.sort((a, b) => {
    return b.data.reviewDate.getTime() - a.data.reviewDate.getTime();
  });

  return reviewedWorks.slice(0, limit);
}
