import { toSentenceArray } from "~/utils";

export type ListItemAuthor = {
  name: string;
  sortName: string;
};

export function ListItemAuthors({ values }: { values: ListItemAuthor[] }) {
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
