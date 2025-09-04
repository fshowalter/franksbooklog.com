import { collator } from "~/utils/collator";

export function SelectOptions({
  options,
}: {
  options: readonly string[];
}): React.JSX.Element {
  const sortedOptions = [...options].sort((a, b) => collator.compare(a, b));

  return (
    <>
      <option key="all" value="All">
        All
      </option>
      {sortedOptions.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </>
  );
}
