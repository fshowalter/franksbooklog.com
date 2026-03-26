/**
 * Create a Name filter function (regex match against name and sortName)
 */
export function createNameFilter<
  TValue extends { name: string; sortName: string },
>(filterValue?: string) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean =>
    regex.test(value.name) || regex.test(value.sortName);
}
