import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getGroupedAvatarList } from "~/features/authors/GroupedAvatarList.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByName } from "./nameSort";

type NameSortItem = SortableByName & {
  name: string;
};

export function nameSortTests(renderItems: (items: NameSortItem[]) => void) {
  describe("name sort", () => {
    it("sorts by sort name A to Z", async ({ expect }) => {
      renderItems([
        { name: "Arthur Conan Doyle", sortName: "Doyle, Arthur Conan" },
        { name: "Zelda Fitzgerald", sortName: "Fitzgerald, Zelda" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Name (A → Z)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const doyleIndex = allText.indexOf("Doyle, Arthur Conan");
      const shellyIndex = allText.indexOf("Shelley, Mar");
      const fitzgeraldIndex = allText.indexOf("Fitzgerald, Zelda");

      expect(doyleIndex).toBeLessThan(fitzgeraldIndex);
      expect(fitzgeraldIndex).toBeLessThan(shellyIndex);
    });

    it("sorts by sort name Z to A", async ({ expect }) => {
      renderItems([
        { name: "Arthur Conan Doyle", sortName: "Doyle, Arthur Conan" },
        { name: "Zelda Fitzgerald", sortName: "Fitzgerald, Zelda" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Name (Z → A)");

      const list = getGroupedAvatarList();
      const allText = list.textContent || "";
      const doyleIndex = allText.indexOf("Doyle, Arthur Conan");
      const shellyIndex = allText.indexOf("Shelley, Mar");
      const fitzgeraldIndex = allText.indexOf("Fitzgerald, Zelda");

      expect(shellyIndex).toBeLessThan(fitzgeraldIndex);
      expect(fitzgeraldIndex).toBeLessThan(doyleIndex);
    });
  });
}
