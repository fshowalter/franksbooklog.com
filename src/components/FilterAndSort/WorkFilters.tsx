import { SelectField } from "~/components/Fields/SelectField";
import { SelectOptions } from "~/components/Fields/SelectOptions";
import { TextField } from "~/components/Fields/TextField";
import { YearField } from "~/components/Fields/YearField";

import type { WorkFiltersValues } from "./WorkFilters.reducer";

export function WorkFilters({
  kind,
  title,
  workYear,
}: {
  kind: {
    initialValue: WorkFiltersValues["kind"];
    onChange: (value: string) => void;
    values: readonly string[];
  };
  title: {
    initialValue: WorkFiltersValues["title"];
    onChange: (value: string) => void;
  };
  workYear: {
    initialValue: WorkFiltersValues["workYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        initialValue={title.initialValue}
        label="Title"
        onInputChange={title.onChange}
        placeholder="Enter all or part of a title"
      />
      <YearField
        initialValues={workYear.initialValue}
        label="Work Year"
        onYearChange={workYear.onChange}
        years={workYear.values}
      />
      <SelectField
        initialValue={kind.initialValue}
        label="Kind"
        onChange={kind.onChange}
      >
        <SelectOptions options={kind.values} />
      </SelectField>
    </>
  );
}
