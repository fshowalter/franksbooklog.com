import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

/**
 * Renders filter controls for work-based listings.
 * Provides filtering options for title search, work year range, and work kind/type.
 * Each filter includes its own state management and change handlers.
 *
 * @param props - The component props
 * @param props.kind - Kind/type filter configuration with values and handlers
 * @param props.title - Title search filter configuration with handlers
 * @param props.workYear - Work year range filter configuration with values and handlers
 * @returns A JSX fragment containing all work filter controls
 */
export function WorkFilters({
  kind,
  title,
  workYear,
}: {
  kind: {
    defaultValue?: string;
    onChange: (value: string) => void;
    values: readonly string[];
  };
  title: {
    defaultValue?: string;
    onChange: (value: string) => void;
  };
  workYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
}): React.JSX.Element {
  return (
    <>
      <TextField
        defaultValue={title.defaultValue}
        label="Title"
        onInputChange={title.onChange}
        placeholder="Enter all or part of a title"
      />
      <YearField
        defaultValues={workYear.defaultValues}
        label="Work Year"
        onYearChange={workYear.onChange}
        years={workYear.values}
      />
      <SelectField
        defaultValue={kind.defaultValue}
        label="Kind"
        onChange={kind.onChange}
      >
        <SelectOptions options={kind.values} />
      </SelectField>
    </>
  );
}
