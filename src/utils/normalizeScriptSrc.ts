export function normalizeScriptSrc(result: string) {
  return result.replaceAll(
    /(src=")(.*)(\/src\/layouts\/Layout\.astro\?astro&type=script&index=\d+&lang\.ts")/g,
    "$1$3",
  );
}
