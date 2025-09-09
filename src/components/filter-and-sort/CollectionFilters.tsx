import { TextField } from "~/components/fields/TextField";

import type { CollectionFiltersValues } from "./CollectionFilters.reducer";

/**
 * Renders filter controls for collection listings (authors, genres, etc.).
 * Provides a simple name-based search filter for filtering collection items
 * by their display name or title.
 * 
 * @param props - The component props
 * @param props.name - Name filter configuration with initial value and change handler
 * @returns A JSX fragment containing the collection filter controls
 */
export function CollectionFilters({
  name,
}: {
  name: {
    initialValue: CollectionFiltersValues["name"];
    onChange: (value: string) => void;
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        initialValue={name.initialValue}
        label="Name"
        onInputChange={name.onChange}
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
