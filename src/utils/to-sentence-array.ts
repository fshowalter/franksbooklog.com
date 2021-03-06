/**
 * Takes an array of words and returns a new array that includes (if needed) commas and a conjunction.
 * @param array The array to parse.
 */
export default function toSentenceArray(
  array: (string | JSX.Element)[]
): (string | JSX.Element)[] {
  const words = array.filter(Boolean);

  if (words.length < 2) {
    return words;
  }

  const lastWords = [" and ", words.pop() as string];
  if (words.length === 1) {
    return [...words, ...lastWords];
  }

  return [
    ...words.reduce(
      (prev, curr) => prev.concat(curr, ", "),
      [] as Array<string | JSX.Element>
    ),
    ...lastWords,
  ];
}
