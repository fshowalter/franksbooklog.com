import { describe, expect, it } from "vitest";

import type { ReviewData, WorkData } from "~/content.config";

import { authorFixtures } from "./__fixtures__/authors";
import { allAuthors, getAuthorDetails } from "./authors";

// Minimal WorkData fixtures for getAuthorDetails tests.
// WorkData is z.infer<typeof WorkSchema> after the year → workYear transform.
const workFixtures: WorkData[] = [
  {
    authors: [{ notes: undefined, slug: "stephen-king" }],
    includedWorks: [],
    kind: "Novel",
    slug: "linked-work",
    sortTitle: "Linked Work",
    subtitle: undefined,
    title: "Linked Work",
    workYear: "2020",
  },
];

// Minimal ReviewData fixtures — slug references "works" collection (Stage 2+).
const reviewFixtures: ReviewData[] = [
  {
    body: "",
    date: new Date("2020-06-15"),
    excerptHtml: "",
    grade: "A",
    intermediateHtml: "",
    slug: { collection: "works", id: "linked-work" },
    synopsis: undefined,
  },
];

describe("allAuthors", () => {
  it("returns all authors from fixtures", () => {
    const result = allAuthors(authorFixtures);
    expect(result).toHaveLength(3);
  });

  it("returns authors with correct fields", () => {
    const result = allAuthors(authorFixtures);
    expect(result[0].slug).toBe("karl-edward-wagner");
    expect(result[0].name).toBe("Karl Edward Wagner");
    expect(result[0].sortName).toBe("Wagner, Karl Edward");
  });

  it("returns empty array for empty input", () => {
    expect(allAuthors([])).toEqual([]);
  });
});

describe("getAuthorDetails", () => {
  it("returns undefined for unknown slug", () => {
    expect(
      getAuthorDetails(
        "unknown-slug",
        authorFixtures,
        workFixtures,
        reviewFixtures,
      ),
    ).toBeUndefined();
  });

  it("returns details for known slug", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      workFixtures,
      reviewFixtures,
    );
    expect(result).toBeDefined();
    expect(result!.author.slug).toBe("stephen-king");
  });

  it("derives distinct kinds from reviewed works for this author", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      workFixtures,
      reviewFixtures,
    )!;
    expect(result.distinctKinds).toEqual(["Novel"]);
  });

  it("derives distinct reviewYears from review dates", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      workFixtures,
      reviewFixtures,
    )!;
    expect(result.distinctReviewYears).toEqual(["2020"]);
  });

  it("derives distinct workYears from work data", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      workFixtures,
      reviewFixtures,
    )!;
    expect(result.distinctWorkYears).toEqual(["2020"]);
  });

  it("excludes works not reviewed (no entry in reviews)", () => {
    const worksWithUnreviewed: WorkData[] = [
      ...workFixtures,
      {
        authors: [{ notes: undefined, slug: "stephen-king" }],
        includedWorks: [],
        kind: "Novella",
        slug: "unreviewed-work",
        sortTitle: "Unreviewed Work",
        subtitle: undefined,
        title: "Unreviewed Work",
        workYear: "2019",
      },
    ];
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      worksWithUnreviewed,
      reviewFixtures,
    )!;
    // Only "linked-work" is reviewed; "unreviewed-work" excluded
    expect(result.distinctKinds).toHaveLength(1);
    expect(result.distinctKinds).toEqual(["Novel"]);
  });

  it("returns empty distinct arrays for author with no reviewed works", () => {
    const result = getAuthorDetails(
      "test-author",
      authorFixtures,
      workFixtures,
      reviewFixtures,
    )!;
    expect(result.distinctKinds).toEqual([]);
    expect(result.distinctReviewYears).toEqual([]);
    expect(result.distinctWorkYears).toEqual([]);
  });

  it("returns distinct values sorted alphabetically", () => {
    const worksWithMultipleKinds: WorkData[] = [
      ...workFixtures,
      {
        authors: [{ notes: undefined, slug: "stephen-king" }],
        includedWorks: [],
        kind: "Anthology",
        slug: "another-work",
        sortTitle: "Another Work",
        subtitle: undefined,
        title: "Another Work",
        workYear: "2021",
      },
    ];
    const reviewsWithMultiple: ReviewData[] = [
      ...reviewFixtures,
      {
        body: "",
        date: new Date("2021-03-10"),
        excerptHtml: "",
        grade: "B",
        intermediateHtml: "",
        slug: { collection: "works", id: "another-work" },
        synopsis: undefined,
      },
    ];
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      worksWithMultipleKinds,
      reviewsWithMultiple,
    )!;
    expect(result.distinctKinds).toEqual(["Anthology", "Novel"]);
  });
});
