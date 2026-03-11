import { markdownToPlainText } from "./markdownToPlainText";

export function markdownToDescription(markdown: string) {
  const contentPlainText = markdownToPlainText(markdown);

  //trim the string to the maximum length
  const description = contentPlainText
    .replaceAll(/\r?\n|\r/g, " ")
    .slice(0, Math.max(0, 160));

  //re-trim if we are in the middle of a word
  return description.slice(
    0,
    Math.max(0, Math.min(description.length, description.lastIndexOf(" "))),
  );
}
