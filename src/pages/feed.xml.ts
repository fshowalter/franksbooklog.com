import rss from "@astrojs/rss";

import { getFeedCoverProps } from "~/api/covers";
import {
  loadExcerptHtml,
  mostRecentReviews,
  type ReviewWithExcerpt,
} from "~/api/reviews";
import { textStarsForGrade } from "~/utils/textStarsForGrade";

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

function addMetaToExcerpt(excerpt: string, review: ReviewWithExcerpt) {
  const meta = `${textStarsForGrade(review.grade)}`;
  return `<p>${meta}</p>${excerpt}`;
}

function authorsToString(authors: ReviewWithExcerpt["authors"]) {
  const authorsArray = authors.map((author) => {
    if (author.notes) {
      return `${author.name} (${author.notes})`;
    }

    return author.name;
  });

  return new Intl.ListFormat().format(authorsArray);
}
