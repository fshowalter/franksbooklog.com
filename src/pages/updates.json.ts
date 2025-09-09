import { getUpdateCoverProps } from "~/api/covers";
import { mostRecentReviews } from "~/api/reviews";

/**
 * Mapping object that converts letter grades to numeric star ratings.
 * Used to transform book review grades into a standardized 0.5-5 star scale
 * for external services and widgets that expect numeric ratings.
 */
const gradeToStars: Record<string, number> = {
  A: 5,
  "A+": 5,
  "A-": 4.5,
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
  "F-": 0.5,
};

/**
 * Astro API endpoint that generates a JSON feed of recent book reviews.
 * Returns structured data including star ratings, cover images, and metadata
 * for integration with external services or widgets.
 * 
 * @returns JSON response containing the latest 6 book reviews with structured data
 */
export async function GET() {
  const reviews = await mostRecentReviews(6);

  const updateItems = await Promise.all(
    reviews.map(async (review) => {
      const coverProps = await getUpdateCoverProps(review);

      return {
        authors: review.authors.map((author) => author.name),
        date: review.date,
        image: coverProps.src,
        slug: review.slug,
        stars: gradeToStars[review.grade],
        title: review.title,
      };
    }),
  );

  return new Response(JSON.stringify(updateItems));
}
