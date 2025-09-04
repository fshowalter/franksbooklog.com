import type { CollectionFilterValues } from "~/components/ListWithFilters/collectionsReducerUtils";

import { TextField } from "~/components/Fields/TextField";

export function CollectionFilters({
  name,
}: {
  name: {
    initialValue: CollectionFilterValues["name"];
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
