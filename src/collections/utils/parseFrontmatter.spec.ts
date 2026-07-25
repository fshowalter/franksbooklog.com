import { describe, it } from "vitest";

import { parseFrontmatter } from "./parseFrontmatter";

describe("parseFrontmatter", () => {
  it("parses the YAML block into an object", ({ expect }) => {
    const { frontmatter } = parseFrontmatter(
      "---\nslug: a-slug\ngrade: B+\n---\n\nBody.",
      "a.md",
    );

    expect(frontmatter).toStrictEqual({ grade: "B+", slug: "a-slug" });
  });

  it("returns everything after the closing fence as the body", ({ expect }) => {
    const { body } = parseFrontmatter(
      "---\nslug: a-slug\n---\n\nFirst para.\n\nSecond.",
      "a.md",
    );

    expect(body).toBe("\n\nFirst para.\n\nSecond.");
  });

  it("parses nested structures", ({ expect }) => {
    const { frontmatter } = parseFrontmatter(
      "---\ntimeline:\n  - date: 2011-11-04\n    progress: 37%\n---\n",
      "a.md",
    );

    expect(frontmatter.timeline).toStrictEqual([
      { date: "2011-11-04", progress: "37%" },
    ]);
  });

  // AIDEV-NOTE: js-yaml 5 leaves timestamps as strings rather than constructing
  // Date objects. The collection schemas depend on this — they coerce with
  // z.coerce.date(). A YAML parser that returned Date objects would still work,
  // but anything that returned a differently-shaped value would not.
  it("leaves dates as strings for the schemas to coerce", ({ expect }) => {
    const { frontmatter } = parseFrontmatter(
      "---\ndate: 2022-10-29\n---\n",
      "a.md",
    );

    expect(frontmatter.date).toBe("2022-10-29");
  });

  it("tolerates a leading byte order mark", ({ expect }) => {
    const { frontmatter } = parseFrontmatter(
      "\u{FEFF}---\nslug: a-slug\n---\n",
      "a.md",
    );

    expect(frontmatter).toStrictEqual({ slug: "a-slug" });
  });

  it("tolerates leading blank lines", ({ expect }) => {
    const { frontmatter } = parseFrontmatter(
      "\n\n---\nslug: a-slug\n---\n",
      "a.md",
    );

    expect(frontmatter).toStrictEqual({ slug: "a-slug" });
  });

  it("throws with the file path when the fence is missing", ({ expect }) => {
    expect(() =>
      parseFrontmatter("Just a body.", "content/reviews/a.md"),
    ).toThrow("Frontmatter not found in content/reviews/a.md");
  });
});
