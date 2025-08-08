import type { FilterableState } from "./filterTools";

type BaseItem = {
  title?: string;
  sortTitle?: string;
  name?: string;
  sortName?: string;
  yearPublished?: string;
  date?: Date;
};

export function handleFilterTitle<
  TItem extends BaseItem,
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  value: string,
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  return (
    clearFilter(value, state, "title") ??
    updateFilter(state, "title", (item) => {
      const normalizedValue = value.toLowerCase();
      if (item.title) {
        return item.title.toLowerCase().includes(normalizedValue);
      }
      if (item.sortTitle) {
        return item.sortTitle.toLowerCase().includes(normalizedValue);
      }
      return false;
    })
  );
}

export function handleFilterName<
  TItem extends BaseItem,
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  value: string,
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  return (
    clearFilter(value, state, "name") ??
    updateFilter(state, "name", (item) => {
      const normalizedValue = value.toLowerCase();
      if (item.name) {
        return item.name.toLowerCase().includes(normalizedValue);
      }
      if (item.sortName) {
        return item.sortName.toLowerCase().includes(normalizedValue);
      }
      return false;
    })
  );
}

export function handleFilterYearPublished<
  TItem extends BaseItem,
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  values: [string, string],
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  const [minValue, maxValue] = values;

  return (
    clearFilter(minValue, state, "yearPublished") ??
    clearFilter(maxValue, state, "yearPublished") ??
    updateFilter(state, "yearPublished", (item) => {
      if (!item.yearPublished) return false;
      const year = item.yearPublished;
      return year >= minValue && year <= maxValue;
    })
  );
}

export function handleFilterYearReviewed<
  TItem extends BaseItem,
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  values: [string, string],
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  const [minValue, maxValue] = values;

  return (
    clearFilter(minValue, state, "reviewYear") ??
    clearFilter(maxValue, state, "reviewYear") ??
    updateFilter(state, "reviewYear", (item) => {
      if (!item.date) return false;
      const year = item.date.getFullYear().toString();
      return year >= minValue && year <= maxValue;
    })
  );
}

export function handleFilterReadingYear<
  TItem extends { readingYear?: string },
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  values: [string, string],
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  const [minValue, maxValue] = values;

  return (
    clearFilter(minValue, state, "readingYear") ??
    clearFilter(maxValue, state, "readingYear") ??
    updateFilter(state, "readingYear", (item) => {
      if (!item.readingYear) return false;
      return item.readingYear >= minValue && item.readingYear <= maxValue;
    })
  );
}

export function handleFilterKind<
  TItem extends { kind?: string },
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  value: string,
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  return (
    clearFilter(value, state, "kind") ??
    updateFilter(state, "kind", (item) => {
      return item.kind === value;
    })
  );
}

export function handleFilterEdition<
  TItem extends { edition?: string },
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  value: string,
  clearFilter: (
    value: string,
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
  ) => FilterableState<TItem, TSortValue, TGroupedValues> | undefined,
  updateFilter: (
    state: FilterableState<TItem, TSortValue, TGroupedValues>,
    key: string,
    predicate: (item: TItem) => boolean,
  ) => FilterableState<TItem, TSortValue, TGroupedValues>,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  return (
    clearFilter(value, state, "edition") ??
    updateFilter(state, "edition", (item) => {
      return item.edition === value;
    })
  );
}

export function handleShowMore<
  TItem,
  TSortValue extends string,
  TGroupedValues,
>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  incrementBy: number,
  groupValues: (values: TItem[], sortValue: TSortValue) => TGroupedValues,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  const showCount = state.showCount + incrementBy;

  return {
    ...state,
    groupedValues: groupValues(
      state.filteredValues.slice(0, showCount),
      state.sortValue,
    ),
    showCount,
  };
}

export function handleSort<TItem, TSortValue extends string, TGroupedValues>(
  state: FilterableState<TItem, TSortValue, TGroupedValues>,
  value: TSortValue,
  sortValues: (values: TItem[], sortOrder: TSortValue) => TItem[],
  groupValues: (values: TItem[], sortValue: TSortValue) => TGroupedValues,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  const filteredValues = sortValues(state.filteredValues, value);

  return {
    ...state,
    filteredValues,
    groupedValues: groupValues(
      filteredValues.slice(0, state.showCount),
      value,
    ),
    sortValue: value,
  };
}

export function createInitialState<
  TItem,
  TSortValue extends string,
  TGroupedValues,
>(
  values: TItem[],
  initialSort: TSortValue,
  showCountDefault: number,
  groupValues: (values: TItem[], sortValue: TSortValue) => TGroupedValues,
): FilterableState<TItem, TSortValue, TGroupedValues> {
  return {
    allValues: values,
    filteredValues: values,
    filters: {},
    groupedValues: groupValues(values.slice(0, showCountDefault), initialSort),
    showCount: showCountDefault,
    sortValue: initialSort,
  };
}