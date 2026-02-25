import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FilterChip } from "./AppliedFilters";

import { AppliedFilters } from "./AppliedFilters";

describe("AppliedFilters", () => {
  let mockOnRemove: ReturnType<typeof vi.fn>;
  let mockOnClearAll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnRemove = vi.fn();
    mockOnClearAll = vi.fn();
  });

  const sampleFilters: FilterChip[] = [
    {
      category: "Kind",
      displayText: "Novel",
      id: "kind-novel",
      label: "Novel",
    },
    {
      category: "Kind",
      displayText: "Short Story",
      id: "kind-short-story",
      label: "Short Story",
    },
    {
      category: "Search",
      displayText: "Search: dune",
      id: "title",
      label: "dune",
    },
  ];

  describe("Visibility", () => {
    it("renders nothing when filters array is empty", () => {
      const { container } = render(
        <AppliedFilters
          filters={[]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders when filters array has items", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(screen.getByText("Applied Filters")).toBeInTheDocument();
    });
  });

  describe("Filter Chips", () => {
    it("renders a chip for each filter", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filters (Kind) show value only
      expect(screen.getByText("Novel")).toBeInTheDocument();
      expect(screen.getByText("Short Story")).toBeInTheDocument();
      // Search filters show "Search: query"
      expect(screen.getByText(/Search: dune/)).toBeInTheDocument();
    });

    it("formats range filter chips with category and label", () => {
      render(
        <AppliedFilters
          filters={[
            {
              category: "Work Year",
              displayText: "Work Year: 1990 to 2000",
              id: "workYear",
              label: "1990 to 2000",
            },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText(/Work Year: 1990 to 2000/)).toBeInTheDocument();
    });

    it("formats simple filter chips without category (value only)", () => {
      render(
        <AppliedFilters
          filters={[
            {
              category: "Kind",
              displayText: "Novel",
              id: "kind-novel",
              label: "Novel",
            },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Should show "Novel" not "Kind: Novel"
      expect(screen.getByText("Novel")).toBeInTheDocument();
      expect(screen.queryByText("Kind: Novel")).not.toBeInTheDocument();
    });

    it("formats grade filter chips with category and label", () => {
      render(
        <AppliedFilters
          filters={[
            {
              category: "Grade",
              displayText: "Grade: A- to B+",
              id: "gradeValue",
              label: "A- to B+",
            },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText(/Grade: A- to B\+/)).toBeInTheDocument();
    });

    it("shows × symbol in each chip", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const buttons = screen.getAllByRole("button");
      // 3 chips + 1 "Clear all" button = 4 total
      const chipButtons = buttons.filter((btn) =>
        btn.getAttribute("aria-label")?.startsWith("Remove"),
      );

      expect(chipButtons).toHaveLength(3);
      for (const btn of chipButtons) {
        expect(btn.textContent).toContain("×");
      }
    });
  });

  describe("Chip Removal", () => {
    it("calls onRemove with correct id when chip × is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Novel"
      const novelChip = screen.getByLabelText("Remove Novel filter");
      await user.click(novelChip);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith("kind-novel");
    });

    it("calls onRemove with different ids for different chips", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Short Story"
      const shortStoryChip = screen.getByLabelText("Remove Short Story filter");
      await user.click(shortStoryChip);

      expect(mockOnRemove).toHaveBeenCalledWith("kind-short-story");

      // Search filter shows "Search: dune"
      const searchChip = screen.getByLabelText("Remove Search: dune filter");
      await user.click(searchChip);

      expect(mockOnRemove).toHaveBeenCalledWith("title");
      expect(mockOnRemove).toHaveBeenCalledTimes(2);
    });
  });

  describe("Clear All", () => {
    it("renders Clear all link", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText("Clear all")).toBeInTheDocument();
    });

    it("calls onClearAll when Clear all is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");
      await user.click(clearAllButton);

      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("chip buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Novel"
      const novelChip = screen.getByLabelText("Remove Novel filter");

      // Tab to focus, Enter to activate
      novelChip.focus();
      expect(novelChip).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnRemove).toHaveBeenCalledWith("kind-novel");
    });

    it("Clear all button is keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");

      clearAllButton.focus();
      expect(clearAllButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it("supports Space key to activate chip removal", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Short Story"
      const shortStoryChip = screen.getByLabelText("Remove Short Story filter");
      shortStoryChip.focus();

      await user.keyboard(" ");
      expect(mockOnRemove).toHaveBeenCalledWith("kind-short-story");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for chip removal buttons", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filters (Kind) show value only: "Novel", "Short Story"
      expect(screen.getByLabelText("Remove Novel filter")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Remove Short Story filter"),
      ).toBeInTheDocument();
      // Search filter shows "Search: dune"
      expect(
        screen.getByLabelText("Remove Search: dune filter"),
      ).toBeInTheDocument();
    });

    it("hides × symbol from screen readers with aria-hidden", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Novel"
      const novelChip = screen.getByLabelText("Remove Novel filter");
      const xSymbol = novelChip.querySelector('[aria-hidden="true"]');

      expect(xSymbol).toBeInTheDocument();
      expect(xSymbol?.textContent).toBe("×");
    });

    it("chip buttons have type='button' to prevent form submission", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Simple filter (Kind) shows value only: "Novel"
      const novelChip = screen.getByLabelText("Remove Novel filter");
      expect(novelChip).toHaveAttribute("type", "button");
    });

    it("Clear all button has type='button' to prevent form submission", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");
      expect(clearAllButton).toHaveAttribute("type", "button");
    });
  });

  describe("Visual Rendering", () => {
    it("matches snapshot with multiple filters", () => {
      const { container } = render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot with single filter", () => {
      const { container } = render(
        <AppliedFilters
          filters={[
            {
              category: "Kind",
              displayText: "Novel",
              id: "kind-novel",
              label: "Novel",
            },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot with search filter", () => {
      const { container } = render(
        <AppliedFilters
          filters={[
            {
              category: "Search",
              displayText: "Search: dune",
              id: "title",
              label: "dune",
            },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
