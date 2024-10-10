export type FilterableState<T, S, G> = {
  allValues: T[];
  filteredValues: T[];
  filters: Record<string, (item: T) => boolean>;
  groupedValues: G;
  showCount: number;
  sortValue: S;
};

export function filterTools<T, S, G>(
  sorter: (items: T[], sortOrder: S) => T[],
  grouper: (items: T[], sortOrder: S) => G,
) {
  const applyFilters = buildApplyFilters(sorter, grouper);

  return {
    applyFilters,
    clearFilter: <State extends FilterableState<T, S, G>>(
      value: string,
      currentState: State,
      key: string,
    ): null | State => {
      if (value != "All") {
        return null;
      }

      const filters = {
        ...currentState.filters,
      };

      delete filters[key];

      return applyFilters(filters, currentState);
    },
    updateFilter: <State extends FilterableState<T, S, G>>(
      currentState: State,
      key: string,
      handler: (item: T) => boolean,
    ): State => {
      const filters = {
        ...currentState.filters,
        [key]: handler,
      };

      return applyFilters(filters, currentState);
    },
  };
}

function buildApplyFilters<T, S, G>(
  sorter: (values: T[], sortOrder: S) => T[],
  grouper: (values: T[], sortOrder: S) => G,
) {
  return function applyFilters<State extends FilterableState<T, S, G>>(
    newFilters: Record<string, (value: T) => boolean>,
    currentState: State,
  ): State {
    const filteredValues = sorter(
      filterValues({
        filters: newFilters,
        values: currentState.allValues,
      }),
      currentState.sortValue,
    );

    const groupedValues = grouper(
      filteredValues.slice(0, currentState.showCount),
      currentState.sortValue,
    );

    return {
      ...currentState,
      filteredValues,
      filters: newFilters,
      groupedValues,
    };
  };
}

function filterValues<T>({
  filters,
  values,
}: {
  filters: Record<string, (arg0: T) => boolean>;
  values: readonly T[];
}): T[] {
  return values.filter((value) => {
    return Object.values(filters).every((filter) => {
      return filter(value);
    });
  });
}
