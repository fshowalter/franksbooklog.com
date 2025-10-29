import path from "node:path";

export function getContentPath(
  kind: "data" | "pages" | "readings" | "reviews",
  subPath?: string,
) {
  if (kind == "reviews" || kind == "pages") {
    return path.join(process.cwd(), "content", kind);
  }

  if (subPath) {
    return path.join(
      process.cwd(),
      "src",
      "api",
      "data",
      "fixtures",
      kind,
      subPath,
    );
  }

  return path.join(process.cwd(), "src", "api", "data", "fixtures", kind);
}
