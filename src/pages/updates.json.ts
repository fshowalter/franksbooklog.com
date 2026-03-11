import { getEntry } from "astro:content";

import { getUpdateCoverProps } from "~/assets/covers";
import { mostRecentReviewedWorks } from "~/utils/mostRecentReviewedWorks";

/**
 * Mapping object that converts letter grades to numeric star ratings.
 * Used to transform book review grades into a standardized 0.5-5 star scale
 * for external services and widgets that expect numeric ratings.
 */
const gradeToStars: Record<string, number> = {
  A: 5,
  "A+": 5,
  "A-": 4.5,
  Abandoned: 0,
  B: 4,
  "B+": 4,
  "B-": 3.5,
  C: 3,
  "C+": 3,
  "C-": 2.5,
  D: 2,
  "D+": 2,
  "D-": 1.5,
  F: 1,
  "F+": 1,
};

/**
 * Astro API endpoint that generates a JSON feed of recent book reviews.
 * Returns structured data including star ratings, cover images, and metadata
 * for integration with external services or widgets.
 *
 * @returns JSON response containing the latest 6 book reviews with structured data
 */
export async function GET() {
  const recentReviewedWorks = await mostRecentReviewedWorks(5);

  const updateItems = await Promise.all(
    recentReviewedWorks.map(async ({ data: reviewedWork }) => {
      const { data: review } = await getEntry(reviewedWork.review);
      const coverProps = await getUpdateCoverProps({
        slug: review.slug,
      });

      return {
        authors: reviewedWork.authors.map((author) => author.name),
        date: review.date,
        excerpt: review.excerptHtml,
        image: coverProps.src,
        kind: reviewedWork.kind,
        slug: review.slug,
        stars: gradeToStars[review.grade],
        title: reviewedWork.title,
        workYear: reviewedWork.workYear,
      };
    }),
  );

  return Response.json(updateItems);
}
