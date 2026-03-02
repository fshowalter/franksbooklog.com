import { CheckboxListField } from "~/components/fields/CheckboxListField";
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
    counts?: Map<string, number>;
    defaultValues?: readonly string[];
    onChange: (values: string[]) => void;
    onClear?: () => void;
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
      <CheckboxListField
        defaultValues={kind.defaultValues}
        label="Kind"
        onChange={kind.onChange}
        onClear={kind.onClear}
        options={kind.values
          .filter((v) => v !== "All")
          .map((v) => ({
            count: kind.counts?.get(v) ?? 0,
            label: v,
            value: v,
          }))}
      />
    </>
  );
}
