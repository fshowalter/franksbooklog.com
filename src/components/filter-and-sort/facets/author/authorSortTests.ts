import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByAuthor } from "./authorSort";

type AuthorSortItem = SortableByAuthor & {
  title: string;
};

/**
 * Shared test suite for the author sort facet (sort-only, no filter).
 * Used by Reviews, which is the only feature that sorts by author.
 *
 * @example
 * authorFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 */
export function authorSortTests(
  renderItems: (items: AuthorSortItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("authorSort", () => {
    it("sorts A → Z by first author", async ({ expect }) => {
      renderItems([
        {
          authors: [
            {
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Zombie Book",
        },
        {
          authors: [
            {
              sortName: "Doyle, Arthur Conan",
            },
          ],
          title: "Detective Book",
        },
        {
          authors: [
            {
              sortName: "Shelley, Mary",
            },
          ],
          title: "Monster Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Doyle, Arthur Conan")).toBeLessThan(
        text.indexOf("Fitzgerald, Zelda"),
      );
      expect(text.indexOf("Fitzgerald, Zelda")).toBeLessThan(
        text.indexOf("Shelley, Mary"),
      );
    });

    it("sorts Z → A by first author", async ({ expect }) => {
      renderItems([
        {
          authors: [
            {
              sortName: "Doyle, Arthur Conan",
            },
          ],
          title: "Detective Book",
        },
        {
          authors: [
            {
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Zombie Book",
        },
        {
          authors: [
            {
              sortName: "Shelley, Mary",
            },
          ],
          title: "Monster Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Shelley, Mary")).toBeLessThan(
        text.indexOf("Fitzgerald, Zelda"),
      );
      expect(text.indexOf("Fitzgerald, Zelda")).toBeLessThan(
        text.indexOf("Doyle, Arthur Conan"),
      );
    });

    it("sorts by first author when item has multiple authors", async ({
      expect,
    }) => {
      renderItems([
        {
          authors: [
            {
              sortName: "Fitzgerald, Zelda",
            },
            {
              sortName: "Doyle, Arthur",
            },
          ],
          title: "Book by Zelda and Arthur",
        },
        {
          authors: [
            {
              sortName: "Doyle, Arthur",
            },
            {
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Book by Arthur and Zelda",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Book by Arthur and Zelda")).toBeLessThan(
        text.indexOf("Book by Zelda and Arthur"),
      );
    });
  });
}
