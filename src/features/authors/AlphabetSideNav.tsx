import { SideNav, SideNavLink } from "~/components/side-nav/SideNav";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Alphabet navigation component for jumping to letter sections.
 * @param props - Component props
 * @param props.groupedValues - Map of grouped cast and crew values by letter
 * @param props.sortValue - Current sort configuration
 * @returns Alphabet navigation component or false if not sorting by name
 */
export function AlphabetSideNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, AuthorsValue[]>;
  sortValue: AuthorsSort;
}): false | React.JSX.Element {
  if (!sortValue.startsWith("name-")) {
    return false;
  }

  const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  if (sortValue == "name-desc") {
    letters.reverse();
  }

  return (
    <SideNav>
      {letters.map((letter) => {
        return (
          <SideNavLink
            key={letter}
            linkFunc={
              groupedValues.has(letter)
                ? (letter: string): string => `#${letter}`
                : undefined
            }
            value={letter}
          />
        );
      })}
    </SideNav>
  );
}
