import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogSort } from "./sortReadingLog";

/**
 * Hook to determine previous, current, and next month dates for calendar navigation.
 * @param filteredValues - Array of filtered viewing values
 * @param sort - Current sort order
 * @param selectedMonthDate - Currently selected month date
 * @returns Tuple of [previousMonthDate, currentMonthDate, nextMonthDate]
 */
export function useMonthNavigation(
  filteredValues: ReadingLogValue[],
  sort: ReadingLogSort,
  selectedMonthDate?: string,
): [string | undefined, string | undefined, string | undefined] {
  "use memo";

  let nextMonthDate;
  let previousMonthDate;
  let currentMonthValue;

  if (filteredValues.length === 0) {
    return [undefined, undefined, undefined];
  }

  selectedMonthDate = selectedMonthDate || filteredValues[0].readingDate;

  const selectedYearAndMonth = selectedMonthDate.slice(0, 7);

  for (const value of filteredValues) {
    if (value.readingDate.startsWith(selectedYearAndMonth)) {
      currentMonthValue = value;
    } else {
      if (sort === "reading-date-desc") {
        if (currentMonthValue) {
          previousMonthDate = value.readingDate;
          break;
        } else {
          nextMonthDate = value.readingDate;
        }
      }

      if (sort === "reading-date-asc")
        if (currentMonthValue) {
          nextMonthDate = value.readingDate;
          break;
        } else {
          previousMonthDate = value.readingDate;
        }
    }
  }

  return [previousMonthDate, currentMonthValue?.readingDate, nextMonthDate];
}
