export function toSentenceArray<T extends JSX.Element | string>(
  values: readonly T[],
): T[] {
  const words = values.filter(Boolean);

  if (words.length < 2) {
    return words;
  }

  const lastWord = words.pop()!;
  const lastWords = [" and ", lastWord];
  return [...words, ...lastWords] as T[];
}
