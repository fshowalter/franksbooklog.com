import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickShowMore,
  getCoverList,
} from "~/components/cover-list/CoverList.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

/**
 * Shared test suite for show-more pagination.
 * Call this inside a feature's describe block, passing a render adapter
 * that renders the feature component with items named "Book 1", "Book 2", etc.
 *
 * @example
 * paginationFacetTests((titles) => {
 *   const values = titles.map((title) => createValue({ title }));
 *   render(<Reviews {...baseProps} values={values} />);
 * });
 */
export function paginationFacetTests(renderItems: (titles: string[]) => void) {
  describe("pagination", () => {
    it("shows more items when Show More is clicked", async ({ expect }) => {
      const titles = Array.from({ length: 150 }, (_, i) => `Book ${i + 1}`);
      renderItems(titles);

      const list = getCoverList();

      expect(within(list).getByText("Book 1")).toBeInTheDocument();
      expect(within(list).getByText("Book 100")).toBeInTheDocument();
      expect(within(list).queryByText("Book 101")).not.toBeInTheDocument();

      const user = getUserWithFakeTimers();
      await clickShowMore(user);

      expect(within(list).getByText("Book 101")).toBeInTheDocument();
      expect(within(list).getByText("Book 150")).toBeInTheDocument();
    });
  });
}
