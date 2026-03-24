import { TextField } from "~/components/fields/TextField";

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
    defaultValue?: string;
    onChange: (value: string) => void;
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        defaultValue={name.defaultValue}
        label="Name"
        onInputChange={name.onChange}
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
