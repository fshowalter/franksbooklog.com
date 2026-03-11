/**
 * Converts special work reference spans into links to reviewed works.
 * Processes HTML text to find spans with data-work-slug attributes and
 * replaces them with links to review pages if the work has been reviewed.
 *
 * @param text - HTML text containing work reference spans
 * @param reviewedWorks - Array of reviewed works with slugs
 * @returns HTML text with work references converted to links
 */
export function linkReviewedWorks(
  text: string | undefined,
  reviewedWorkSlugs: string[],
) {
  if (!text) {
    return text;
  }

  let result = text;

  const re = new RegExp(
    /(<span data-work-slug="([^"]*)">)(.*?)(<\/span>)/,
    "g",
  );

  const matches = [...text.matchAll(re)];

  for (const match of matches) {
    const matchingSlug = reviewedWorkSlugs.find((slug) => slug === match[2]);

    if (matchingSlug) {
      result = result.replace(
        `<span data-work-slug="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${matchingSlug}/">${match[3]}</a>`,
      );
    } else {
      if (match[3]) {
        result = result.replace(
          `<span data-work-slug="${match[2]}">${match[3]}</span>`,
          match[3],
        );
      }
    }
  }

  return result;
}
