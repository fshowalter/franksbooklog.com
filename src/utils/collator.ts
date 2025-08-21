// Sorting utilities
export const collator = new Intl.Collator("en", {
  ignorePunctuation: true,
  numeric: true,
  sensitivity: "base",
});
