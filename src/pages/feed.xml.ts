import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import type { Review } from "~/api/reviews";

import { getFeedCoverProps } from "~/api/covers";
import { allReviews, loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { textStarsForGrade } from "~/components/grade/textStarsForGrade";

/**
 * Astro API endpoint that generates an RSS feed for the most recent book reviews.
 * Creates RSS items with cover images, grades, and excerpt content.
 *
 * @returns RSS response containing the latest 10 book reviews with metadata
 */
export async function GET() {
  const [worksEntries, reviewsEntries, authorsEntries, readingsEntries] =
    await Promise.all([
      getCollection("works"),
      getCollection("reviews"),
      getCollection("authors"),
      getCollection("readings"),
    ]);
  const works = worksEntries.map((e) => e.data);
  const reviewsData = reviewsEntries.map((e) => e.data);
  const authors = authorsEntries.map((e) => e.data);
  const readings = readingsEntries.map((e) => e.data);
  const { reviews: allReviewsList } = allReviews(works, reviewsData, authors, readings);
  const recentReviews = mostRecentReviews(allReviewsList, 10);

  return rss({
    customData:
      "<image><url>https://www.franksbooklog.com/assets/favicon-128.png</url><title>Frank's Book Log</title><link>https://www.franksbooklog.com/</link></image>",
    // `<description>` field in output xml
    description: "Reviews of current, cult, classic, and forgotten books.",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await Promise.all(
      recentReviews.map(async (review) => {
        const cover = await getFeedCoverProps(review);
        const excerpt = loadExcerptHtml(review);

        return {
          content: `<img src="${cover.src}" alt="">${addMetaToExcerpt(excerpt, review)}`,
          link: `https://www.franksbooklog.com/reviews/${review.slug}/`,
          pubDate: review.date,
          title: `${review.title} by ${authorsToString(review.authors)}`,
        };
      }),
    ),
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: "https://www.franksbooklog.com",
    // `<title>` field in output xml
    title: "Frank's Book Log",
  });
}

/**
 * Adds star rating metadata to the beginning of a review excerpt for RSS feed display.
 * Prepends the review's grade as text stars before the excerpt content.
 *
 * @param excerpt - The HTML excerpt content from the review
 * @param review - The review object containing grade and other metadata
 * @returns HTML string with star rating metadata prepended to the excerpt
 */
function addMetaToExcerpt(excerpt: string, review: Review) {
  const meta = `${textStarsForGrade(review.grade)}`;
  return `<p>${meta}</p>${excerpt}`;
}

/**
 * Converts an array of author objects to a human-readable string format.
 * Handles author names with optional notes and formats them using the browser's
 * Intl.ListFormat for proper comma separation and conjunction.
 *
 * @param authors - Array of author objects with name and optional notes
 * @returns Formatted string of author names, e.g., "John Doe, Jane Smith (Editor), and Bob Johnson"
 */
function authorsToString(authors: Review["authors"]) {
  const authorsArray = authors.map((author) => {
    if (author.notes) {
      return `${author.name} (${author.notes})`;
    }

    return author.name;
  });

  return new Intl.ListFormat().format(authorsArray);
}
