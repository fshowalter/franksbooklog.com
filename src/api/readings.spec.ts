import { describe, expect, it } from "vitest";

import { authorFixtures } from "./__fixtures__/authors";
import { readingDataFixtures } from "./__fixtures__/readings";
import { workDataFixtures } from "./__fixtures__/reviewedWorks";
import { reviewDataFixtures } from "./__fixtures__/reviews";
import { allReadingEntries } from "./readings";

describe("allReadingEntries", () => {
  it("returns empty result for empty inputs", () => {
    const result = allReadingEntries([], [], [], []);
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

  it("expands 2 readings into 3 timeline entries", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    // dark-crusade has 2 timeline entries; carrie has 1
    expect(result.readingEntries).toHaveLength(3);
  });

  it("sorts entries ascending by composite date-sequence key", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    const dates = result.readingEntries.map((e) => e.readingEntryDate);
    expect(dates).toEqual(["2012-05-13", "2012-05-18", "2023-06-15"]);
  });

  it("assigns 1-based readingEntrySequence after sort", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    const sequences = result.readingEntries.map((e) => e.readingEntrySequence);
    expect(sequences).toEqual([1, 2, 3]);
  });

  it("sets progress from timeline entry", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    const progresses = result.readingEntries.map((e) => e.progress);
    expect(progresses).toEqual(["14%", "Finished", "Finished"]);
  });

  it("sets slug to work slug", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.readingEntries[0].slug).toBe(
      "dark-crusade-by-karl-edward-wagner",
    );
    expect(result.readingEntries[2].slug).toBe("carrie-by-stephen-king");
  });

  it("enriches authors from authorsMap", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.readingEntries[0].authors).toEqual([
      {
        name: "Karl Edward Wagner",
        slug: "karl-edward-wagner",
        sortName: "Wagner, Karl Edward",
      },
    ]);
    expect(result.readingEntries[2].authors).toEqual([
      { name: "Stephen King", slug: "stephen-king", sortName: "King, Stephen" },
    ]);
  });

  it("sets reviewed from reviewedSlugs set", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    // Both dark-crusade and carrie are in reviewDataFixtures
    expect(result.readingEntries[0].reviewed).toBe(true);
    expect(result.readingEntries[2].reviewed).toBe(true);
  });

  it("counts terminal entries (Finished/Abandoned) as workCount", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    // Entry 1 (14%) excluded; entries 2 (Finished) and 3 (Finished) counted
    expect(result.workCount).toBe(2);
  });

  it("counts books and short stories from terminal entries", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.bookCount).toBe(2);
    expect(result.shortStoryCount).toBe(0);
    expect(result.abandonedCount).toBe(0);
  });

  it("extracts distinct editions sorted alphabetically", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.distinctEditions).toEqual([
      "First Edition",
      "Trade Paperback",
    ]);
  });

  it("extracts distinct kinds sorted alphabetically", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.distinctKinds).toEqual(["Novel"]);
  });

  it("extracts distinct reading years sorted", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.distinctReadingYears).toEqual(["2012", "2023"]);
  });

  it("extracts distinct work years sorted", () => {
    const result = allReadingEntries(
      readingDataFixtures,
      workDataFixtures,
      reviewDataFixtures,
      authorFixtures,
    );
    expect(result.distinctWorkYears).toEqual(["1974", "1976"]);
  });
});
