/**
 * Locale-aware string collator for consistent sorting across the application.
 * Configured for English locale with numeric sorting, case-insensitive comparison,
 * and punctuation-agnostic sorting.
 */
export const collator = new Intl.Collator("en", {
  ignorePunctuation: true,
  numeric: true,
  sensitivity: "base",
});
