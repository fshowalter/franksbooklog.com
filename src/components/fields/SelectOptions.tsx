import { collator } from "~/utils/collator";

/**
 * Renders a sorted list of option elements for select inputs.
 * Automatically adds an "All" option at the top and sorts the provided
 * options alphabetically using a locale-aware collator.
 *
 * @param props - The component props
 * @param props.options - Array of option values to render as option elements
 * @returns A JSX element containing the sorted option elements
 */
export function SelectOptions({
  options,
}: {
  options: readonly string[];
}): React.JSX.Element {
  const sortedOptions = [...options].toSorted((a, b) => collator.compare(a, b));

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
