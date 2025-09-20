import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Alphabet navigation component for the authors list page.
 * Shows A-Z letters as jump navigation when sorted by name.
 * Only renders when the current sort is name-based, otherwise returns false.
 *
 * @param props - Component props
 * @param props.groupedValues - Map of grouped author values by first letter
 * @param props.sortValue - Current sort value to determine display and order
 * @returns Alphabet navigation or false if not name-sorted
 */
export function AlphabetNav({
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
    <nav className={`sticky top-0 z-15 bg-[#333]`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {letters.map((letter) => {
          return (
            <LetterLink
              key={letter}
              letter={letter}
              linkFunc={
                groupedValues.has(letter)
                  ? (letter: string): string => `#${letter}`
                  : undefined
              }
            />
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Internal component for individual letter links in the alphabet navigation.
 * Renders as a clickable link if authors exist for that letter, otherwise as plain text.
 *
 * @param props - Component props
 * @param props.letter - The letter to display (A-Z)
 * @param props.linkFunc - Optional function to generate anchor link URL
 * @returns Letter navigation item (link or plain text)
 */
function LetterLink({
  letter,
  linkFunc,
}: {
  letter: string;
  linkFunc?: (letter: string) => string;
}): React.JSX.Element {
  return (
    <li
      className={`
        snap-start text-center font-sans
        ${linkFunc ? "text-inverse" : `text-grey`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            block transform-gpu p-4 transition-all
            hover:bg-canvas hover:text-default
          `}
          href={linkFunc(letter)}
        >
          {letter}
        </a>
      ) : (
        <div className={`p-4`}>{letter}</div>
      )}
    </li>
  );
}
