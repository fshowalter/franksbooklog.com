import rss from "@astrojs/rss";
import { getEntry } from "astro:content";

import { getFeedCoverProps } from "~/assets/covers";
import { formatWorkAuthors } from "~/utils/formatWorkAuthors";
import { mostRecentReviewedTitles } from "~/utils/mostRecentReviewedTitles";

import { textStarsForGrade } from "./textStarsForGrade";

export async function feed() {
  const recentReviewedWorks = await mostRecentReviewedTitles(10);

  return rss({
    customData:
      "<image><url>https://www.franksbooklog.com/assets/favicon-128.png</url><title>Frank's Book Log</title><link>https://www.franksbooklog.com/</link></image>",
    // `<description>` field in output xml
    description: "Reviews of current, cult, classic, and forgotten books.",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await Promise.all(
      recentReviewedWorks.map(async ({ data: reviewedWork }) => {
        const { data: review } = await getEntry(reviewedWork.review);
        const cover = await getFeedCoverProps({ slug: review.slug });

        return {
          content: `<img src="${cover.src}" alt="">${addGradeToExcerpt(review.excerptHtml, review.grade)}`,
          link: `https://www.franksbooklog.com/reviews/${review.slug}/`,
          pubDate: review.date,
          title: `${reviewedWork.title} by ${formatWorkAuthors(reviewedWork.authors)}`,
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
function addGradeToExcerpt(excerpt: string, grade: string) {
  const meta = `${textStarsForGrade(grade)}`;
  return `<p>${meta}</p>${excerpt}`;
}
