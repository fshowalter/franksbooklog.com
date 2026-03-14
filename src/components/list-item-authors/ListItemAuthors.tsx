import { formatWorkAuthors } from "~/utils/formatWorkAuthors";

/**
 * Represents an author for display in list items.
 */
type ListItemAuthor = {
  /** The author's display name */
  name: string;
  notes: string | undefined;
  sortName?: string;
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
  useSortName = false,
  values,
}: {
  useSortName?: boolean;
  values: ListItemAuthor[];
}): React.JSX.Element {
  return (
    <div className={`text-[15px]/4 font-normal tracking-prose text-muted`}>
      {formatWorkAuthors(values, { useSortName })}
    </div>
  );
}
