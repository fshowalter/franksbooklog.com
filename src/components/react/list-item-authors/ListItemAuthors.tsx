import { formatTitleAuthors } from "~/utils/formatTitleAuthors";

/**
 * Represents an author for display in list items.
 */
type ListItemAuthor = {
  /** The author's display name */
  name: string;
  notes: string | undefined;
  sortName?: string;
};

export function ListItemAuthors({
  useSortName = false,
  values,
}: {
  useSortName?: boolean;
  values: ListItemAuthor[];
}): React.JSX.Element {
  return (
    <div className={`text-[15px]/4 font-normal tracking-prose text-muted`}>
      {formatTitleAuthors(values, { useSortName })}
    </div>
  );
}
