/**
 * Normalizes script source attributes in rendered HTML by removing internal build paths.
 * Cleans up Astro's internal script URLs to make them more presentable in output.
 *
 * @param result - The HTML string to process
 * @returns HTML string with normalized script src attributes
 */
export function normalizeScriptSrc(result: string) {
  return result.replaceAll(
    /(src=")(.*)(\/src\/layouts\/Layout\.astro\?astro&type=script&index=\d+&lang\.ts")/g,
    "$1$3",
  );
}
