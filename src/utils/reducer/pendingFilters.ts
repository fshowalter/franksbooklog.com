import { filterValues } from "./filterValues";

export type PendingFilterState<TValue> = {
  allValues: TValue[];
  pendingFilteredCount: number;
  pendingFilters: Record<string, (value: TValue) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >;
};

/**
 * Update a pending filter
 */
export function updatePendingFilter<
  TValue,
  T extends PendingFilterState<TValue>,
>(
  state: T,
  key: string,
  filterFn: ((value: TValue) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): T {
  const pendingFilters = { ...state.pendingFilters };
  const pendingFilterValues = { ...state.pendingFilterValues };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
    delete pendingFilterValues[key];
  } else {
    pendingFilters[key] = filterFn;
    pendingFilterValues[key] = value;
  }

  const pendingFilteredCount = filterValues({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(pendingFilterValues).length > 0,
    pendingFilteredCount,
    pendingFilters,
    pendingFilterValues,
  };
}
