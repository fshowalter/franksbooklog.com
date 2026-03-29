import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { nameFilterTests } from "~/components/filter-and-sort/facets/name/nameFilterTests";
import { nameSortTests } from "~/components/filter-and-sort/facets/name/nameSortTests";
import { reviewCountSortTests } from "~/components/filter-and-sort/facets/review-count/reviewCountSortTests";
import { getGroupedAvatarList } from "~/features/authors/GroupedAvatarList.testHelper";

import type { AuthorsProps, AuthorsValue } from "./Authors";

import { Authors } from "./Authors";

function createAuthorValue(
  sortName: string,
  overrides: Partial<AuthorsValue> = {},
): AuthorsValue {
  const names = sortName.split(",");

  return {
    avatarImageProps: undefined,
    name: `${names[1]} ${names[0]}`,
    reviewCount: 5,
    slug: sortName,
    sortName,
    ...overrides,
  };
}

const baseProps: AuthorsProps = {
  initialSort: "name-asc",
  values: [],
};

describe("Authors", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  nameFilterTests((items) => {
    const authors = items.map(({ name, sortName }) =>
      createAuthorValue(sortName, { name }),
    );
    render(<Authors {...baseProps} values={authors} />);
  });

  nameSortTests((items) => {
    const authors = items.map(({ name, sortName }) =>
      createAuthorValue(sortName, { name }),
    );
    render(<Authors {...baseProps} values={authors} />);
  });

  reviewCountSortTests((items) => {
    const authors = items.map(({ name, reviewCount }) =>
      createAuthorValue(name, { reviewCount }),
    );
    render(<Authors {...baseProps} values={authors} />);
  }, getGroupedAvatarList);
});
