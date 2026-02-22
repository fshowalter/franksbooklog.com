import { describe, expect, it } from "vitest";

import { alltimeStatFixture, yearStatFixtures } from "./__fixtures__/stats";
import { allStatYears, alltimeStats, statsForYear } from "./stats";

describe("allStatYears", () => {
  it("returns empty array for empty yearStats", () => {
    expect(allStatYears([])).toEqual([]);
  });

  it("returns sorted year strings", () => {
    const result = allStatYears(yearStatFixtures);
    expect(result).toEqual(["2011", "2022", "2024"]);
  });

  it("returns a new array each call", () => {
    const result1 = allStatYears(yearStatFixtures);
    const result2 = allStatYears(yearStatFixtures);
    expect(result1).not.toBe(result2);
  });
});

describe("alltimeStats", () => {
  it("returns the data unchanged", () => {
    const result = alltimeStats(alltimeStatFixture);
    expect(result).toBe(alltimeStatFixture);
  });

  it("preserves bookCount", () => {
    const result = alltimeStats(alltimeStatFixture);
    expect(result.bookCount).toBe(37);
  });

  it("preserves reviewCount", () => {
    const result = alltimeStats(alltimeStatFixture);
    expect(result.reviewCount).toBe(30);
  });
});

describe("statsForYear", () => {
  it("returns undefined for unknown year", () => {
    expect(statsForYear("1999", yearStatFixtures)).toBeUndefined();
  });

  it("returns stats for a known year", () => {
    const result = statsForYear("2024", yearStatFixtures);
    expect(result).toBeDefined();
    expect(result?.bookCount).toBe(20);
    expect(result?.workCount).toBe(18);
  });

  it("returns stats for another known year", () => {
    const result = statsForYear("2011", yearStatFixtures);
    expect(result).toBeDefined();
    expect(result?.bookCount).toBe(5);
  });

  it("returns undefined for empty yearStats", () => {
    expect(statsForYear("2024", [])).toBeUndefined();
  });
});
