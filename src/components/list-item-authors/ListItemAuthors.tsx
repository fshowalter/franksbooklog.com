import { formatTitleAuthors } from "~/utils/formatTitleAuthors";

export function ListItemAuthors({
  useSortName = false,
  values,
}: {
  useSortName?: boolean;
  values: Parameters<typeof formatTitleAuthors>[0];
}): React.JSX.Element {
  return (
    <div className={`text-[15px]/4 font-normal tracking-prose text-muted`}>
      {formatTitleAuthors(values, { useSortName })}
    </div>
  );
}
