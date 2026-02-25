import { describe, expect, it } from "vitest";

import {
  buildGradeChip,
  buildMultiSelectChips,
  buildSearchChip,
  buildYearRangeChip,
} from "./filterChipBuilders";

describe("buildSearchChip", () => {
  it("returns empty array for undefined", () => {
    expect(buildSearchChip(undefined, "title")).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(buildSearchChip("", "title")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(buildSearchChip("   ", "title")).toEqual([]);
  });

  it("returns a chip for a non-empty value", () => {
    expect(buildSearchChip("dune", "title")).toEqual([
      {
        category: "Search",
        displayText: "Search: dune",
        id: "title",
        label: "dune",
      },
    ]);
  });

  it("uses the provided fieldId", () => {
    const [chip] = buildSearchChip("tolkien", "name");
    expect(chip.id).toBe("name");
  });
});

describe("buildMultiSelectChips", () => {
  it("returns empty array for undefined", () => {
    expect(buildMultiSelectChips(undefined, "Kind", "kind")).toEqual([]);
  });

  it("returns empty array for empty array", () => {
    expect(buildMultiSelectChips([], "Kind", "kind")).toEqual([]);
  });

  it("returns one chip per value", () => {
    expect(
      buildMultiSelectChips(["Novel", "Short Story"], "Kind", "kind"),
    ).toEqual([
      {
        category: "Kind",
        displayText: "Novel",
        id: "kind-novel",
        label: "Novel",
      },
      {
        category: "Kind",
        displayText: "Short Story",
        id: "kind-short-story",
        label: "Short Story",
      },
    ]);
  });

  it("uses provided category and idPrefix", () => {
    const [chip] = buildMultiSelectChips(["Audiobook"], "Edition", "edition");
    expect(chip.category).toBe("Edition");
    expect(chip.id).toBe("edition-audiobook");
  });

  it("uses provided category for status chips", () => {
    const [chip] = buildMultiSelectChips(
      ["Reviewed"],
      "Status",
      "reviewedStatus",
    );
    expect(chip.category).toBe("Status");
    expect(chip.id).toBe("reviewedStatus-reviewed");
  });
});

describe("buildYearRangeChip", () => {
  const years = ["1990", "1995", "2000", "2005", "2010"];

  it("returns empty array for undefined value", () => {
    expect(
      buildYearRangeChip(undefined, years, "Work Year", "workYear"),
    ).toEqual([]);
  });

  it("returns empty array when distinctYears is empty", () => {
    expect(
      buildYearRangeChip(["2000", "2005"], [], "Work Year", "workYear"),
    ).toEqual([]);
  });

  it("returns empty array when range equals the full available range", () => {
    expect(
      buildYearRangeChip(["1990", "2010"], years, "Work Year", "workYear"),
    ).toEqual([]);
  });

  it("returns a chip when the range is narrowed", () => {
    expect(
      buildYearRangeChip(["1995", "2005"], years, "Work Year", "workYear"),
    ).toEqual([
      {
        category: "Work Year",
        displayText: "Work Year: 1995 to 2005",
        id: "workYear",
        label: "1995 to 2005",
      },
    ]);
  });

  it("shows a single year label when min equals max", () => {
    const [chip] = buildYearRangeChip(
      ["2000", "2000"],
      years,
      "Work Year",
      "workYear",
    );
    expect(chip.label).toBe("2000");
    expect(chip.displayText).toBe("Work Year: 2000");
  });

  it("uses provided category and fieldId", () => {
    const [chip] = buildYearRangeChip(
      ["1995", "2005"],
      years,
      "Review Year",
      "reviewYear",
    );
    expect(chip.category).toBe("Review Year");
    expect(chip.id).toBe("reviewYear");
  });

  it("returns a chip when only the min bound is narrowed", () => {
    expect(
      buildYearRangeChip(["2000", "2010"], years, "Work Year", "workYear"),
    ).toHaveLength(1);
  });

  it("returns a chip when only the max bound is narrowed", () => {
    expect(
      buildYearRangeChip(["1990", "2005"], years, "Work Year", "workYear"),
    ).toHaveLength(1);
  });
});

describe("buildGradeChip", () => {
  it("returns empty array for undefined", () => {
    expect(buildGradeChip()).toEqual([]);
  });

  it("returns empty array for the full range [2, 16]", () => {
    expect(buildGradeChip([2, 16])).toEqual([]);
  });

  it("returns a chip when the range is narrowed", () => {
    // 14 = A-, 16 = A+
    expect(buildGradeChip([14, 16])).toEqual([
      {
        category: "Grade",
        displayText: "Grade: A- to A+",
        id: "gradeValue",
        label: "A- to A+",
      },
    ]);
  });

  it("shows a single letter label when min equals max", () => {
    // 15 = A
    const [chip] = buildGradeChip([15, 15]);
    expect(chip.label).toBe("A");
    expect(chip.displayText).toBe("Grade: A");
  });

  it("returns a chip when only the min bound is narrowed", () => {
    // 11 = B-, 16 = A+
    expect(buildGradeChip([11, 16])).toHaveLength(1);
  });

  it("returns a chip when only the max bound is narrowed", () => {
    // 2 = F-, 12 = B
    expect(buildGradeChip([2, 12])).toHaveLength(1);
  });
});
