import rss from "@astrojs/rss";

import { getFeedCoverProps } from "~/api/covers";
import {
  loadExcerptHtml,
  mostRecentReviews,
  type ReviewWithExcerpt,
} from "~/api/reviews";
import { textStarsForGrade } from "~/components/grade/textStarsForGrade";

/**
 * Astro API endpoint that generates an RSS feed for the most recent book reviews.
 * Creates RSS items with cover images, grades, and excerpt content.
 *
 * @returns RSS response containing the latest 10 book reviews with metadata
 */
export async function GET() {
  const reviews = await mostRecentReviews(10);

  const rssItems = await Promise.all(
    reviews.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return rss({
    customData:
      "<image><url>https://www.franksbooklog.com/assets/favicon-128.png</url><title>Frank's Book Log</title><link>https://www.franksbooklog.com/</link></image>",
    // `<description>` field in output xml
    description: "Reviews of current, cult, classic, and forgotten books.",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await Promise.all(
      rssItems.map(async (item) => {
        const cover = await getFeedCoverProps(item);

        return {
          content: `<img src="${
            cover.src
          }" alt="">${addMetaToExcerpt(item.excerpt, item)}`,
          link: `https://www.franksbooklog.com/reviews/${item.slug}/`,
          pubDate: item.date,
          title: `${item.title} by ${authorsToString(item.authors)}`,
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
 * @param {string} excerpt - The HTML excerpt content from the review
 * @param {ReviewWithExcerpt} review - The review object containing grade and other metadata
 * @returns {string} HTML string with star rating metadata prepended to the excerpt
 */
function addMetaToExcerpt(excerpt: string, review: ReviewWithExcerpt) {
  const meta = `${textStarsForGrade(review.grade)}`;
  return `<p>${meta}</p>${excerpt}`;
}

/**
 * Converts an array of author objects to a human-readable string format.
 * Handles author names with optional notes and formats them using the browser's
 * Intl.ListFormat for proper comma separation and conjunction.
 *
 * @param {ReviewWithExcerpt["authors"]} authors - Array of author objects with name and optional notes
 * @returns {string} Formatted string of author names, e.g., "John Doe, Jane Smith (Editor), and Bob Johnson"
 */
function authorsToString(authors: ReviewWithExcerpt["authors"]) {
  const authorsArray = authors.map((author) => {
    if (author.notes) {
      return `${author.name} (${author.notes})`;
    }

    return author.name;
  });

  return new Intl.ListFormat().format(authorsArray);
}
