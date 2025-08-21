export function displayDate(date: Date | string | undefined) {
  if (!date) {
    return "";
  }

  const viewingDate = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    weekday: "short",
    year: "numeric",
  });

  const parts = formatter.formatToParts(viewingDate);
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  return `${month} ${day}, ${year}`;
}
