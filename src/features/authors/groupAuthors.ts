import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

export function groupAuthors(
  filteredValues: AuthorsValue[],
  sort: AuthorsSort,
) {
  const grouped = new Map<string, AuthorsValue[]>();

  for (const value of filteredValues) {
    const key = groupForTitleValue(value, sort);
    const group = grouped.get(key) || [];
    group.push(value);
    grouped.set(key, group);
  }

  return grouped;
}

function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

function groupForTitleValue(value: AuthorsValue, sort: AuthorsSort) {
  switch (sort) {
    case "name-asc":
    case "name-desc": {
      return getGroupLetter(value.sortName);
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
  }
}
