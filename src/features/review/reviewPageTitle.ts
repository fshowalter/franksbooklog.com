import type { CollectionEntry } from "astro:content";

import { formatWorkAuthors } from "~/utils/formatWorkAuthors";

export function reviewPageTitle(
  reviewedWork: CollectionEntry<"reviewedWorks">["data"],
) {
  const titleAuthorNames = formatWorkAuthors(reviewedWork.authors, "short");

  const title = `${reviewedWork.title} by ${titleAuthorNames}`;

  const kind = reviewedWork.kind == "Short Story" ? "story" : "book";

  return `${title} ${kind} review`;
}
