import { toSentenceArray } from "~/utils/toSentenceArray";

/**
 * Represents an author for display in list items.
 */
type ListItemAuthor = {
  /** The author's display name */
  name: string;
};

/**
 * Renders a list of authors in a readable sentence format.
 * Uses the toSentenceArray utility to format multiple authors with proper
 * punctuation and conjunctions (e.g., "Author A, Author B, and Author C").
 *
 * @param props - The component props
 * @param props.values - Array of author objects to display
 * @returns A JSX element containing the formatted author list
 */
export function ListItemAuthors({
  values,
}: {
  values: ListItemAuthor[];
}): React.JSX.Element {
  return (
    <div className={`text-[15px]/4 font-normal tracking-prose text-muted`}>
      {toSentenceArray(
        values.map((value) => <span key={value.name}>{value.name}</span>),
      )}
    </div>
  );
}
