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
    <nav
      className={`
        sticky top-[89px] z-nav-menu scrollbar-hidden h-[calc(100vh-148px)]
        overflow-y-auto bg-sidenav
        tablet:top-24 tablet:h-[calc(100vh-96px)] tablet:px-4
        laptop:top-[97px]
      `}
    >
      <div className={`flex flex-col text-md font-semibold tracking-wide`}>
        <h3
          className={`
            sr-only shrink-0 snap-start p-4 font-sans text-xs font-normal
            tracking-wide whitespace-nowrap text-subtle uppercase
          `}
        >
          Jump to:
        </h3>
        <ul className={`contents`}>
          {letters.map((letter) => {
            const href = groupedValues.has(letter) ? `#${letter}` : undefined;

            return (
              <li
                className={`
                  snap-start text-center font-light
                  first-of-type:pt-6
                  last-of-type:pb-6
                  ${href ? "text-default" : `text-grey`}
                `}
                key={letter}
              >
                {href ? (
                  <a
                    className={`
                      group/item block transform-gpu px-4 py-3 transition-all
                      hover:scale-110 hover:text-emphasis
                    `}
                    href={href}
                  >
                    {letter}
                  </a>
                ) : (
                  <div className={`px-4 py-3`}>{letter}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
