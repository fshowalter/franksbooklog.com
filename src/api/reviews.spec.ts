import { describe, expect, it } from "vitest";

import { authorFixtures } from "./__fixtures__/authors";
import { readingDataFixtures } from "./__fixtures__/readings";
import { workDataFixtures } from "./__fixtures__/reviewedWorks";
import { reviewDataFixtures } from "./__fixtures__/reviews";
import {
  allReviews,
  getContentPlainText,
  loadContent,
  loadExcerptHtml,
  mostRecentReviews,
} from "./reviews";

const works = workDataFixtures;
const reviews = reviewDataFixtures;
const authors = authorFixtures;
const readings = readingDataFixtures;

describe("allReviews", () => {
  it("returns a review for each work", () => {
    const { reviews: result } = allReviews(works, reviews, authors, readings);
    expect(result).toHaveLength(works.length);
  });

  it("merges work data and review data", () => {
    const { reviews: result } = allReviews(works, reviews, authors, readings);
    const review = result.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;
    expect(review.slug).toBe("dark-crusade-by-karl-edward-wagner");
    expect(review.title).toBe("Dark Crusade");
    expect(review.reviewSequence).toBe(
      "2012-05-18-01-dark-crusade-by-karl-edward-wagner",
    );
    // From ReviewData
    expect(review.body).toBe("A dark and moody review body with footnotes.");
    expect(review.intermediateHtml).toContain("span data-work-slug");
  });

  it("computes distinct kinds", () => {
    const { distinctKinds } = allReviews(works, reviews, authors, readings);
    expect(distinctKinds).toEqual(["Novel"]);
  });

  it("computes distinct review years", () => {
    const { distinctReviewYears } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    expect(distinctReviewYears).toContain("2012");
    expect(distinctReviewYears).toContain("2023");
  });

  it("computes distinct work years", () => {
    const { distinctWorkYears } = allReviews(works, reviews, authors, readings);
    expect(distinctWorkYears).toContain("1974");
    expect(distinctWorkYears).toContain("1976");
  });

  it("returns sorted distinct values", () => {
    const { distinctReviewYears } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const sorted = [...distinctReviewYears].toSorted();
    expect(distinctReviewYears).toEqual(sorted);
  });
});

describe("loadContent", () => {
  it("applies linkReviewedWorks to intermediateHtml", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const review = allReviewsList.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;

    const result = loadContent(review, readings, reviews, []);

    expect(result.content).toContain(
      '<a href="/reviews/linked-work/">Linked Work</a>',
    );
    expect(result.content).not.toContain("span data-work-slug");
  });

  it("applies linkReviewedWorks to reading notes", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const review = allReviewsList.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;

    const result = loadContent(review, readings, reviews, []);

    const reading = result.readings[0];
    expect(reading.readingNotes).toContain(
      '<a href="/reviews/linked-work/">Linked Work</a>',
    );
  });

  it("enriches readings with edition and timeline from ReadingData", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const review = allReviewsList.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;

    const result = loadContent(review, readings, reviews, []);

    const reading = result.readings[0];
    expect(reading.edition).toBe("First Edition");
    expect(reading.timeline).toHaveLength(2);
    expect(reading.timeline[0].progress).toBe("14%");
    expect(reading.timeline[1].progress).toBe("Finished");
  });

  it("preserves JSON reading fields in enriched reading", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const review = allReviewsList.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;

    const result = loadContent(review, readings, reviews, []);

    const reading = result.readings[0];
    expect(reading.readingSequence).toBe(1);
    expect(reading.abandoned).toBe(false);
    expect(reading.isAudiobook).toBe(false);
    expect(reading.readingTime).toBe(6);
  });

  it("computes excerptPlainText from body", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const review = allReviewsList.find(
      (r) => r.slug === "dark-crusade-by-karl-edward-wagner",
    )!;

    const result = loadContent(review, readings, reviews, []);

    expect(result.excerptPlainText).toBeTruthy();
    expect(typeof result.excerptPlainText).toBe("string");
  });
});

describe("loadExcerptHtml", () => {
  it("returns excerptHtml directly from ReviewData", () => {
    const reviewData = reviewDataFixtures[0];
    const result = loadExcerptHtml(reviewData);
    expect(result).toBe(reviewData.excerptHtml);
    expect(result).toBe("<p>A dark and moody review body.</p>");
  });

  it("returns synopsis-based excerpt when synopsis is present", () => {
    const reviewData = reviewDataFixtures[1];
    const result = loadExcerptHtml(reviewData);
    expect(result).toBe("<p>A gripping horror novel.</p>");
  });
});

describe("mostRecentReviews", () => {
  it("returns the most recent reviews up to the limit", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const result = mostRecentReviews(allReviewsList, 1);
    expect(result).toHaveLength(1);
    // 2023-06-20-01 > 2012-05-18-01 lexicographically
    expect(result[0].slug).toBe("carrie-by-stephen-king");
  });

  it("returns all reviews when limit exceeds count", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const result = mostRecentReviews(allReviewsList, 100);
    expect(result).toHaveLength(allReviewsList.length);
  });

  it("sorts by reviewSequence descending", () => {
    const { reviews: allReviewsList } = allReviews(
      works,
      reviews,
      authors,
      readings,
    );
    const result = mostRecentReviews(allReviewsList, allReviewsList.length);
    const sequences = result.map((r) => r.reviewSequence);
    const sorted = sequences.toSorted((a, b) => b.localeCompare(a));
    expect(sequences).toEqual(sorted);
  });
});

describe("getContentPlainText", () => {
  it("strips markdown formatting from content", () => {
    const result = getContentPlainText("**bold** and _italic_ text");
    expect(result).not.toContain("**");
    expect(result).not.toContain("_");
    expect(result.trim()).toBe("bold and italic text");
  });

  it("returns a string", () => {
    const result = getContentPlainText("Simple text.");
    expect(typeof result).toBe("string");
  });
});
