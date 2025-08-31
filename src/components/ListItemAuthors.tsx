import { toSentenceArray } from "~/utils/toSentenceArray";

type ListItemAuthor = {
  name: string;
};

export function ListItemAuthors({
  values,
}: {
  values: ListItemAuthor[];
}): React.JSX.Element {
  return (
    <div
      className={`text-[15px] leading-4 font-normal tracking-prose text-muted`}
    >
      {toSentenceArray(
        values.map((value) => <span key={value.name}>{value.name}</span>),
      )}
    </div>
  );
}
