import type { CollectionEntry } from "astro:content";

import { formatTitleAuthors } from "~/utils/formatTitleAuthors";

export function reviewPageTitle(
  reviewedTitle: CollectionEntry<"reviewedTitles">["data"],
) {
  const titleAuthorNames = formatTitleAuthors(reviewedTitle.authors, {
    style: "short",
  });

  const title = `${reviewedTitle.title} by ${titleAuthorNames}`;

  const kind = reviewedTitle.kind == "Short Story" ? "story" : "book";

  return `${title} ${kind} review`;
}
