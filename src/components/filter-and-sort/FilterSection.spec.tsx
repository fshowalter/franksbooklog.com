import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FilterSection } from "./FilterSection";

describe("FilterSection", () => {
  it("renders open by default", () => {
    render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).toHaveAttribute("open");
  });

  it("renders closed when defaultOpen is false", () => {
    render(
      <FilterSection defaultOpen={false} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).not.toHaveAttribute("open");
  });

  it("displays the section title", () => {
    render(
      <FilterSection title="Genres">
        <div>Content</div>
      </FilterSection>,
    );

    expect(screen.getByText("Genres")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <FilterSection title="Test Section">
        <div>Test Content</div>
      </FilterSection>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("uses native details/summary for keyboard accessibility", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
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
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // summary element should be properly structured
    const summary = screen.getByText("Test Section").closest("summary");
    expect(summary).toBeInTheDocument();
    expect(summary?.tagName).toBe("SUMMARY");
  });

  it("renders disclosure triangle", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Check for SVG disclosure triangle
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("sets initial height for open state", () => {
    const { container } = render(
      <FilterSection defaultOpen={true} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Find the panel div (first child of details after summary)
    const details = container.querySelector("details");
    const panel = details?.querySelector(":scope > div") as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel?.style.height).toBe("");
  });

  it("sets initial height for closed state", () => {
    const { container } = render(
      <FilterSection defaultOpen={false} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Find the panel div (first child of details after summary)
    const details = container.querySelector("details");
    const panel = details?.querySelector(":scope > div") as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel?.style.height).toBe("0px");
  });

  // AIDEV-NOTE: Animation behavior (toggle transitions, height changes) cannot be tested
  // in jsdom as it doesn't support CSS transitions or the TransitionEvent API.
  // These animations must be verified through manual browser testing.

  it("snapshot test - open state (default)", () => {
    const { container } = render(
      <FilterSection title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });

  it("snapshot test - closed state", () => {
    const { container } = render(
      <FilterSection defaultOpen={false} title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });
});
