import { describe, it } from "vitest";

import { getCoverList } from "~/components/cover-list/CoverList.testHelper";
import { clickSortOption } from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type AuthorItem = {
  authors: readonly { name: string; notes?: string; sortName: string }[];
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
export function authorFacetTests(renderItems: (items: AuthorItem[]) => void) {
  describe("author sort", () => {
    it("sorts A → Z by first author", async ({ expect }) => {
      renderItems([
        {
          authors: [
            {
              name: "Zelda Fitzgerald",
              notes: undefined,
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Zombie Book",
        },
        {
          authors: [
            {
              name: "Arthur Conan Doyle",
              notes: undefined,
              sortName: "Doyle, Arthur Conan",
            },
          ],
          title: "Detective Book",
        },
        {
          authors: [
            {
              name: "Mary Shelley",
              notes: undefined,
              sortName: "Shelley, Mary",
            },
          ],
          title: "Monster Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (A → Z)");

      const list = getCoverList();
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
              name: "Arthur Conan Doyle",
              notes: undefined,
              sortName: "Doyle, Arthur Conan",
            },
          ],
          title: "Detective Book",
        },
        {
          authors: [
            {
              name: "Zelda Fitzgerald",
              notes: undefined,
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Zombie Book",
        },
        {
          authors: [
            {
              name: "Mary Shelley",
              notes: undefined,
              sortName: "Shelley, Mary",
            },
          ],
          title: "Monster Book",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (Z → A)");

      const list = getCoverList();
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
              name: "Zelda Fitzgerald",
              notes: undefined,
              // "Aelda" (not "Zelda") is intentional: it places this book between
              // "Doyle, Arthur" and "Fitzgerald, Zelda" alphabetically, verifying
              // that sort uses the first author's sortName, not their visible name.
              sortName: "Fitzgerald, Aelda",
            },
            {
              name: "Arthur Conan Doyle",
              notes: undefined,
              sortName: "Doyle, Arthur",
            },
          ],
          title: "Book by Zelda and Arthur",
        },
        {
          authors: [
            {
              name: "Arthur Conan Doyle",
              notes: undefined,
              sortName: "Doyle, Arthur",
            },
            {
              name: "Zelda Fitzgerald",
              notes: undefined,
              sortName: "Fitzgerald, Zelda",
            },
          ],
          title: "Book by Arthur and Zelda",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Author (A → Z)");

      const list = getCoverList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Book by Arthur and Zelda")).toBeLessThan(
        text.indexOf("Book by Zelda and Arthur"),
      );
    });
  });
}
