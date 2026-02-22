import { describe, expect, it } from "vitest";

import { authorFixtures } from "./__fixtures__/authors";
import { reviewedWorkFixtures } from "./__fixtures__/reviewedWorks";
import { allAuthors, getAuthorDetails } from "./authors";

describe("allAuthors", () => {
  it("returns all authors from fixtures", () => {
    const result = allAuthors(authorFixtures);
    expect(result).toHaveLength(2);
  });

  it("returns authors with correct fields", () => {
    const result = allAuthors(authorFixtures);
    expect(result[0].slug).toBe("stephen-king");
    expect(result[0].name).toBe("Stephen King");
    expect(result[0].sortName).toBe("King, Stephen");
  });

  it("returns reviewedWorks as reference objects", () => {
    const result = allAuthors(authorFixtures);
    expect(result[0].reviewedWorks[0]).toEqual({
      collection: "reviewedWorks",
      id: "linked-work",
    });
  });

  it("returns empty array for empty input", () => {
    expect(allAuthors([])).toEqual([]);
  });
});

describe("getAuthorDetails", () => {
  it("returns undefined for unknown slug", () => {
    expect(
      getAuthorDetails("unknown-slug", authorFixtures, reviewedWorkFixtures),
    ).toBeUndefined();
  });

  it("returns details for known slug", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      reviewedWorkFixtures,
    );
    expect(result).toBeDefined();
    expect(result!.author.slug).toBe("stephen-king");
  });

  it("resolves work references to extract distinct kinds", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      reviewedWorkFixtures,
    )!;
    expect(result.distinctKinds).toEqual(["Novel"]);
  });

  it("resolves work references to extract distinct reviewYears", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      reviewedWorkFixtures,
    )!;
    expect(result.distinctReviewYears).toEqual(["2020"]);
  });

  it("resolves work references to extract distinct workYears", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      reviewedWorkFixtures,
    )!;
    expect(result.distinctWorkYears).toEqual(["2020"]);
  });

  it("filters out orphaned references (work not in collection)", () => {
    const result = getAuthorDetails(
      "stephen-king",
      authorFixtures,
      reviewedWorkFixtures,
    )!;
    // "orphaned-work" is in authorFixtures but not in reviewedWorkFixtures
    // Only "linked-work" (1 work) should contribute to distinct values
    expect(result.distinctKinds).toHaveLength(1);
  });

  it("returns empty distinct arrays for author with no works", () => {
    const result = getAuthorDetails(
      "test-author",
      authorFixtures,
      reviewedWorkFixtures,
    )!;
    expect(result.distinctKinds).toEqual([]);
    expect(result.distinctReviewYears).toEqual([]);
    expect(result.distinctWorkYears).toEqual([]);
  });

  it("returns distinct values sorted alphabetically", () => {
    const worksWithMultipleKinds = [
      ...reviewedWorkFixtures,
      {
        ...reviewedWorkFixtures[0],
        kind: "Anthology" as const,
        slug: "another-work",
      },
    ];
    const authorsWithMultipleWorks = [
      {
        ...authorFixtures[0],
        reviewedWorks: [
          { collection: "reviewedWorks" as const, id: "linked-work" },
          { collection: "reviewedWorks" as const, id: "another-work" },
        ],
      },
    ];
    const result = getAuthorDetails(
      "stephen-king",
      authorsWithMultipleWorks,
      worksWithMultipleKinds,
    )!;
    expect(result.distinctKinds).toEqual(["Anthology", "Novel"]);
  });
});
