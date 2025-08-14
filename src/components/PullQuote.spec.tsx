import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { PullQuote } from "./PullQuote";

describe("PullQuote", () => {
  it("renders pull quote with text", ({ expect }) => {
    const { container } = render(
      <PullQuote>This is a memorable quote from the book.</PullQuote>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders pull quote with attribution", ({ expect }) => {
    const { container } = render(
      <PullQuote attribution="David Hackworth">
        There are only two things in life that interest me. One is sex and the
        other is adventure.
      </PullQuote>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders pull quote with custom className", ({ expect }) => {
    const { container } = render(
      <PullQuote className="text-center">
        An organization does well only those things the Boss checks.
      </PullQuote>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
