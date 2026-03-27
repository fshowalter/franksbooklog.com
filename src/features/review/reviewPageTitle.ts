import type { CollectionEntry } from "astro:content";

import { formatWorkAuthors } from "~/utils/formatWorkAuthors";

export function reviewPageTitle(
  reviewedTitle: CollectionEntry<"reviewedTitles">["data"],
) {
  const titleAuthorNames = formatWorkAuthors(reviewedTitle.authors, {
    style: "short",
  });

  const title = `${reviewedTitle.title} by ${titleAuthorNames}`;

  const kind = reviewedTitle.kind == "Short Story" ? "story" : "book";

  return `${title} ${kind} review`;
}
