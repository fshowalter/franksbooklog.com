import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnimatedDetailsDisclosure } from "./AnimatedDetailsDisclosure";

describe("FilterSection", () => {
  it("renders open by default", () => {
    render(
      <AnimatedDetailsDisclosure title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    const details = screen.getByRole("group");
    expect(details).toHaveAttribute("open");
  });

  it("renders closed when defaultOpen is false", () => {
    render(
      <AnimatedDetailsDisclosure defaultOpen={false} title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    const details = screen.getByRole("group");
    expect(details).not.toHaveAttribute("open");
  });

  it("displays the section title", () => {
    render(
      <AnimatedDetailsDisclosure title="Genres">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    expect(screen.getByText("Genres")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <AnimatedDetailsDisclosure title="Test Section">
        <div>Test Content</div>
      </AnimatedDetailsDisclosure>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("uses native details/summary for keyboard accessibility", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    // Verify we're using native details/summary elements
    // These provide built-in keyboard navigation (Enter/Space to toggle)
    const details = container.querySelector("details");
    const summary = container.querySelector("summary");

    expect(details).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(summary?.parentElement).toBe(details);

    // Note: Native details/summary keyboard behavior (Enter/Space) is handled
    // by the browser and doesn't need explicit testing in jsdom
  });

  it("has accessible summary element", () => {
    render(
      <AnimatedDetailsDisclosure title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    // summary element should be properly structured
    const summary = screen.getByText("Test Section").closest("summary");
    expect(summary).toBeInTheDocument();
    expect(summary?.tagName).toBe("SUMMARY");
  });

  it("renders disclosure triangle", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    // Check for SVG disclosure triangle
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("sets initial height for open state", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure defaultOpen={true} title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    // Find the panel div (first child of details after summary)
    const details = container.querySelector("details");
    const panel = details?.querySelector(":scope > div") as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel?.style.height).toBe("");
  });

  it("sets initial height for closed state", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure defaultOpen={false} title="Test Section">
        <div>Content</div>
      </AnimatedDetailsDisclosure>,
    );

    // Find the panel div (first child of details after summary)
    const details = container.querySelector("details");
    const panel = details?.querySelector(":scope > div") as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel?.style.height).toBe("0px");
  });

  // Animation behavior (toggle transitions, height changes) cannot be tested
  // in jsdom as it doesn't support CSS transitions or the TransitionEvent API.
  // These animations must be verified through manual browser testing.

  it("snapshot test - open state (default)", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure title="Genres">
        <div>Filter content here</div>
      </AnimatedDetailsDisclosure>,
    );

    expect(container).toMatchSnapshot();
  });

  it("snapshot test - closed state", () => {
    const { container } = render(
      <AnimatedDetailsDisclosure defaultOpen={false} title="Genres">
        <div>Filter content here</div>
      </AnimatedDetailsDisclosure>,
    );

    expect(container).toMatchSnapshot();
  });
});
