import { toSentenceArray } from "~/utils/toSentenceArray";

export function ListItemAuthors({
  values,
}: {
  values: {
    name: string;
  }[];
}): React.JSX.Element {
  return (
    <div
      className={`text-[15px] leading-4 font-normal tracking-prose text-muted`}
    >
      {toSentenceArray(
        values.map((value) => (
          <span className="font-normal text-muted" key={value.name}>
            {value.name}
          </span>
        )),
      )}
    </div>
  );
}
