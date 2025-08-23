import { toSentenceArray } from "~/utils";

type Author = {
  name: string;
  sortName: string;
};

export function ListItemAuthors({ values }: { values: Author[] }) {
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
