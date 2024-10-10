import { join } from "path";

export function getContentPath(
  kind: "data" | "pages" | "readings" | "reviews",
  path?: string,
) {
  if (path) {
    return join(process.cwd(), "content", kind, path);
  }

  return join(process.cwd(), "content", kind);
}
