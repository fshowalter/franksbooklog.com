import { CheckboxListField } from "~/components/react/filter-and-sort/fields/CheckboxListField";
import { YearField } from "~/components/react/filter-and-sort/fields/YearField";

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
  workYear,
}: {
  kind: {
    counts?: Map<string, number>;
    defaultValues?: readonly string[];
    onChange: (values: string[]) => void;
    onClear?: () => void;
    values: readonly string[];
  };
  workYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
}): React.JSX.Element {
  return (
    <>
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
