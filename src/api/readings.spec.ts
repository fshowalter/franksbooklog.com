import { describe, expect, it } from "vitest";

import { readingEntryFixtures } from "./__fixtures__/readingEntries";
import { allReadingEntries } from "./readings";

describe("allReadingEntries", () => {
  it("returns empty result for empty entries array", () => {
    const result = allReadingEntries([]);
    expect(result.readingEntries).toHaveLength(0);
    expect(result.workCount).toBe(0);
    expect(result.bookCount).toBe(0);
    expect(result.shortStoryCount).toBe(0);
    expect(result.abandonedCount).toBe(0);
    expect(result.distinctEditions).toEqual([]);
    expect(result.distinctKinds).toEqual([]);
    expect(result.distinctReadingYears).toEqual([]);
    expect(result.distinctWorkYears).toEqual([]);
  });

  it("passes entries through as readingEntries", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.readingEntries).toBe(readingEntryFixtures);
  });

  it("counts finished and abandoned as works", () => {
    const result = allReadingEntries(readingEntryFixtures);
    // All 3 fixtures are Finished or Abandoned
    expect(result.workCount).toBe(3);
  });

  it("counts books (non-short-story works)", () => {
    const result = allReadingEntries(readingEntryFixtures);
    // 2 Novels (Finished + Abandoned), 1 Short Story
    expect(result.bookCount).toBe(2);
  });

  it("counts short stories", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.shortStoryCount).toBe(1);
  });

  it("counts abandoned works", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.abandonedCount).toBe(1);
  });

  it("extracts distinct editions sorted alphabetically", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.distinctEditions).toEqual([
      "Mass Market Paperback",
      "Paperback",
      "Trade Paperback",
    ]);
  });

  it("extracts distinct kinds sorted alphabetically", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.distinctKinds).toEqual(["Novel", "Short Story"]);
  });

  it("extracts distinct reading years sorted", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.distinctReadingYears).toEqual(["2022", "2023"]);
  });

  it("extracts distinct work years sorted", () => {
    const result = allReadingEntries(readingEntryFixtures);
    expect(result.distinctWorkYears).toEqual(["1953", "1965", "1969"]);
  });
});
