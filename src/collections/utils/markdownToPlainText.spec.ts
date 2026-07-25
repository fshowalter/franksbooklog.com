import { describe, it } from "vitest";

import { markdownToPlainText } from "./markdownToPlainText";

describe("markdownToPlainText", () => {
  it("strips inline markup and reduces links to their text", ({ expect }) => {
    expect(markdownToPlainText("Hello *world* and [link](/x).")).toBe(
      "Hello world and link.\n",
    );
  });

  it("reduces an image to its alt text", ({ expect }) => {
    expect(markdownToPlainText("![alt text](/img.png)")).toBe("alt text\n");
  });

  it("separates paragraphs with a blank line", ({ expect }) => {
    expect(markdownToPlainText("One.\n\nTwo.")).toBe("One.\n\nTwo.\n");
  });

  it("removes footnote references and definitions", ({ expect }) => {
    expect(markdownToPlainText("Text[^1] here.\n\n[^1]: The note.")).toBe(
      "Text here.\n",
    );
  });

  it("drops raw HTML tags but keeps their text content", ({ expect }) => {
    expect(
      markdownToPlainText('A <span data-title-id="x">"T"</span> ref.'),
    ).toBe("A “T” ref.\n");
  });

  it("still applies smart punctuation", ({ expect }) => {
    expect(markdownToPlainText(`a--b ... "q"`)).toBe("a—b … “q”\n");
  });
});
