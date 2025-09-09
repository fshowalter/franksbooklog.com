import path from "node:path";

/**
 * Constructs an absolute file path to content directories within the project.
 * Used to locate JSON data files, Markdown content, and other assets.
 * 
 * @param kind - The type of content directory ("data", "pages", "readings", or "reviews")
 * @param subPath - Optional subdirectory or file path within the content kind directory
 * @returns Absolute path to the specified content location
 * 
 * @example
 * ```typescript
 * // Get path to data directory: /project/content/data
 * getContentPath("data")
 * 
 * // Get path to specific file: /project/content/reviews/book-review.md
 * getContentPath("reviews", "book-review.md")
 * ```
 */
export function getContentPath(
  kind: "data" | "pages" | "readings" | "reviews",
  subPath?: string,
) {
  if (subPath) {
    return path.join(process.cwd(), "content", kind, subPath);
  }

  return path.join(process.cwd(), "content", kind);
}
