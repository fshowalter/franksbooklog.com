export type CalendarWeek = CalendarDay[];

export type ReadingsSort = "reading-date-asc" | "reading-date-desc";

import type { ReadingsValue } from "./Readings";

type CalendarDay = {
  date: number | undefined;
  dayOfWeek?: string;
  readings: ReadingsValue[];
};

export function selectWeeksForMonth(
  month: Date,
  filteredReadings: ReadingsValue[],
): CalendarWeek[] {
  const utcMonth = month.getUTCMonth();
  const utcYear = month.getUTCFullYear();

  const groupedReadings = groupValues(filteredReadings);
  const days = getCalendarDays(utcMonth, utcYear, groupedReadings);
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function getCalendarDays(
  monthIndex: number,
  year: number,
  groupedReadings: Map<string, ReadingsValue[]>,
): CalendarDay[] {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const startPadding = firstDay.getUTCDay();
  const daysInMonth = lastDay.getUTCDate();

  const days: CalendarDay[] = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add empty cells for days before month starts
  for (let i = 0; i < startPadding; i++) {
    days.push({ date: undefined, readings: [] });
  }

  // Add days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDate = new Date(Date.UTC(year, monthIndex, date));
    const dayOfWeek = weekdays[currentDate.getUTCDay()];

    // Use pre-indexed viewings for O(1) lookup
    // Key format: "year-month-day" without padding
    const dateKey = `${year}-${monthIndex + 1}-${date}`;
    const readings = groupedReadings.get(dateKey) || [];

    days.push({
      date,
      dayOfWeek,
      readings,
    });
  }

  // Fill remaining cells to complete the grid
  while (days.length % 7 !== 0) {
    days.push({ date: undefined, readings: [] });
  }

  return days;
}

// AIDEV-NOTE: Group readings by date for calendar display
// Creates a map where keys are "year-month-day" and values are arrays of readings for that day
function groupForValue(value: ReadingsValue): string {
  const date = new Date(value.readingDate);
  // Key format: "year-month-day" without padding (matches calendar lookup needs)
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

// Custom grouping function that sorts readings within each day by sequence
// The sortValue parameter is required by the groupFn interface but not used here
function groupValues(values: ReadingsValue[]): Map<string, ReadingsValue[]> {
  const grouped = new Map<string, ReadingsValue[]>();

  for (const value of values) {
    const key = groupForValue(value);
    const group = grouped.get(key) || [];
    group.push(value);
    grouped.set(key, group);
  }

  // Sort readings within each day by sequence (higher sequence = older, so reverse sort)
  for (const dayReadings of grouped.values()) {
    dayReadings.sort((a, b) => a.entrySequence - b.entrySequence);
  }

  return grouped;
}
