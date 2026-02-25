import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import type { FilterChip } from "./AppliedFilters";
import type { SortOption } from "./FilterAndSortContainer";

import { FilterAndSortContainer } from "./FilterAndSortContainer";
import {
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "./FilterAndSortContainer.testHelper";

// Mock scrollIntoView for all tests
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Test helpers
type MockProps = {
  activeFilters?: FilterChip[];
  filters: React.ReactElement;
  hasPendingFilters: boolean;
  onApplyFilters: ReturnType<typeof vi.fn>;
  onClearFilters: ReturnType<typeof vi.fn>;
  onFilterDrawerOpen: ReturnType<typeof vi.fn>;
  onRemoveFilter?: ReturnType<typeof vi.fn>;
  onResetFilters: ReturnType<typeof vi.fn>;
  pendingFilteredCount: number;
  sortProps: {
    currentSortValue: string;
    onSortChange: ReturnType<typeof vi.fn>;
    sortOptions: readonly SortOption[];
  };
  totalCount: number;
};

const createMockProps = (overrides: Partial<MockProps> = {}): MockProps => ({
  filters: (
    <div data-testid="filters-content">
      <input placeholder="Filter input" type="text" />
      <button type="button">Filter button</button>
    </div>
  ),
  hasPendingFilters: false,
  onApplyFilters: vi.fn(),
  onClearFilters: vi.fn(),
  onFilterDrawerOpen: vi.fn(),
  onResetFilters: vi.fn(),
  pendingFilteredCount: 100,
  sortProps: {
    currentSortValue: "title-asc",
    onSortChange: vi.fn(),
    sortOptions: [
      { label: "Title (A → Z)", value: "title-asc" },
      { label: "Title (Z → A)", value: "title-desc" },
    ],
  },
  totalCount: 100,
  ...overrides,
});

describe("FilterAndSortContainer", () => {
  let mockProps: MockProps;

  beforeEach(() => {
    mockProps = createMockProps();
  });

  describe("result count display", () => {
    it("displays the total count of results", ({ expect }) => {
      render(
        <FilterAndSortContainer {...mockProps} totalCount={250}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      expect(screen.getByText("250")).toBeInTheDocument();
      expect(screen.getByText("Results")).toBeInTheDocument();
    });

    it("updates count when totalCount prop changes", ({ expect }) => {
      const { rerender } = render(
        <FilterAndSortContainer {...mockProps} totalCount={100}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      expect(screen.getByText("100")).toBeInTheDocument();

      rerender(
        <FilterAndSortContainer {...mockProps} totalCount={50}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      expect(screen.getByText("50")).toBeInTheDocument();
    });
  });

  describe("filter drawer interactions", () => {
    afterEach(() => {
      document.body.classList.remove("overflow-hidden");
    });

    it("opens filter drawer when toggle button is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);

      await clickToggleFilters(user);

      expect(filterButton.getAttribute("aria-expanded")).toBe("true");
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);
      expect(mockProps.onFilterDrawerOpen).toHaveBeenCalled();
    });

    it("closes filter drawer when toggle button is clicked again", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await clickToggleFilters(user);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      // Close drawer
      await clickToggleFilters(user);

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer when escape key is pressed", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      await clickToggleFilters(user);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      await user.keyboard("{Escape}");

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer when clicking outside on backdrop", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const { container } = render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      await clickToggleFilters(user);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      // Find and click the backdrop
      const backdrop = container.querySelector(
        '[aria-hidden="true"].fixed.inset-0',
      );
      expect(backdrop).toBeTruthy();

      if (backdrop) {
        act(() => {
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          backdrop.dispatchEvent(clickEvent);
        });
      }

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer when View Results button is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      await clickToggleFilters(user);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      await clickViewResults(user);

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
      expect(mockProps.onApplyFilters).toHaveBeenCalled();
    });

    it("closes filter drawer when Close button is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      await clickToggleFilters(user);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      await clickCloseFilters(user);

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
      expect(mockProps.onResetFilters).toHaveBeenCalled();
    });

    it("disables Clear button when there are no pending filters", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps} hasPendingFilters={false}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const clearButton = screen.getByRole("button", {
        name: "Clear all filters",
      });
      expect(clearButton).toBeDisabled();
    });

    it("enables Clear button when there are pending filters", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps} hasPendingFilters={true}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const clearButton = screen.getByRole("button", {
        name: "Clear all filters",
      });
      expect(clearButton).not.toBeDisabled();
    });

    it("disables View Results button when pending filtered count is zero", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps} pendingFilteredCount={0}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      expect(viewResultsButton).toBeDisabled();
    });

    it("enables View Results button when pending filtered count is greater than zero", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps} pendingFilteredCount={10}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      expect(viewResultsButton).not.toBeDisabled();
    });
  });

  describe("filter count display", () => {
    it("displays pending filtered count in View Results button", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps} pendingFilteredCount={42}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      expect(viewResultsButton.textContent).toContain("View 42 Results");
    });

    it("updates pending count when filters change", async ({ expect }) => {
      const user = userEvent.setup();
      const { rerender } = render(
        <FilterAndSortContainer {...mockProps} pendingFilteredCount={100}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      let viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      expect(viewResultsButton.textContent).toContain("View 100 Results");

      rerender(
        <FilterAndSortContainer {...mockProps} pendingFilteredCount={25}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      expect(viewResultsButton.textContent).toContain("View 25 Results");
    });
  });

  describe("sort functionality", () => {
    it("displays current sort value", ({ expect }) => {
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const sortSelect = screen.getByLabelText<HTMLSelectElement>("Sort");
      expect(sortSelect.value).toBe("title-asc");
    });

    it("calls onSortChange when sort option is selected", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      const props = createMockProps({
        sortProps: {
          ...mockProps.sortProps,
          onSortChange,
        },
      });

      render(
        <FilterAndSortContainer {...props}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      const sortSelect = screen.getByLabelText("Sort");
      await user.selectOptions(sortSelect, "title-desc");

      expect(onSortChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("body overflow management", () => {
    afterEach(() => {
      // Clean up body classes from previous tests
      document.body.classList.remove("overflow-hidden");
    });

    it("adds overflow-hidden class to body when drawer opens", async ({
      expect,
    }) => {
      const user = userEvent.setup();

      // Ensure clean state
      document.body.classList.remove("overflow-hidden");

      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      expect(document.body.classList.contains("overflow-hidden")).toBe(false);

      await clickToggleFilters(user);

      expect(document.body.classList.contains("overflow-hidden")).toBe(true);
    });

    it("removes overflow-hidden class from body when drawer closes", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);

      await clickToggleFilters(user);

      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });
  });

  describe("mobile sort section", () => {
    // AIDEV-NOTE: jsdom doesn't support CSS media queries, so tablet:hidden class
    // won't actually hide elements. These tests verify the radio buttons are rendered
    // in the DOM structure, which will be hidden on desktop via Tailwind classes.

    it("renders Sort by section in drawer", async ({ expect }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      expect(screen.getByText("Sort by")).toBeInTheDocument();
    });

    it("displays all sort options as radio buttons in drawer", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const { container } = render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      // Query for radio inputs by name attribute to find mobile sort radios
      const radioButtons = container.querySelectorAll(
        'input[type="radio"][name="sort"]',
      );
      expect(radioButtons).toHaveLength(2);

      // Verify the radios have the correct labels
      const titleAscRadio = [...radioButtons].find(
        (radio) => (radio as HTMLInputElement).value === "title-asc",
      );
      const titleDescRadio = [...radioButtons].find(
        (radio) => (radio as HTMLInputElement).value === "title-desc",
      );

      expect(titleAscRadio).toBeTruthy();
      expect(titleDescRadio).toBeTruthy();
    });

    it("pre-selects current sort value in radio group", async ({ expect }) => {
      const user = userEvent.setup();
      const { container } = render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );

      const selectedRadio = [...radioButtons].find(
        (radio) => radio.value === "title-asc",
      );
      const unselectedRadio = [...radioButtons].find(
        (radio) => radio.value === "title-desc",
      );

      expect(selectedRadio?.checked).toBe(true);
      expect(unselectedRadio?.checked).toBe(false);
    });

    it("does not call onSortChange immediately when radio button is selected", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      const props = createMockProps({
        sortProps: {
          ...mockProps.sortProps,
          onSortChange,
        },
      });

      const { container } = render(
        <FilterAndSortContainer {...props}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );
      const titleDescRadio = [...radioButtons].find(
        (radio) => radio.value === "title-desc",
      );

      if (titleDescRadio) {
        await user.click(titleDescRadio);
      }

      // Sort should NOT be applied immediately - only when "View Results" is clicked
      expect(onSortChange).not.toHaveBeenCalled();
    });

    it("calls onSortChange when View Results is clicked after changing sort", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      const onApplyFilters = vi.fn();
      const props = createMockProps({
        onApplyFilters,
        sortProps: {
          ...mockProps.sortProps,
          onSortChange,
        },
      });

      const { container } = render(
        <FilterAndSortContainer {...props}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );
      const titleDescRadio = [...radioButtons].find(
        (radio) => radio.value === "title-desc",
      );

      if (titleDescRadio) {
        await user.click(titleDescRadio);
      }

      // Click "View Results" button
      const viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      await user.click(viewResultsButton);

      expect(onSortChange).toHaveBeenCalledTimes(1);
      expect(onSortChange).toHaveBeenCalledWith("title-desc");
      expect(onApplyFilters).toHaveBeenCalledTimes(1);
    });

    it("keeps drawer open after sort selection", async ({ expect }) => {
      const user = userEvent.setup();
      const { container } = render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      const radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );
      const titleDescRadio = [...radioButtons].find(
        (radio) => radio.value === "title-desc",
      );

      if (titleDescRadio) {
        await user.click(titleDescRadio);
      }

      // Drawer should still be open
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");
    });

    it("resets sort selection when drawer is closed without clicking View Results", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      const props = createMockProps({
        sortProps: {
          ...mockProps.sortProps,
          onSortChange,
        },
      });

      const { container } = render(
        <FilterAndSortContainer {...props}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      // Open drawer and change sort
      await clickToggleFilters(user);
      let radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );
      const titleDescRadio = [...radioButtons].find(
        (radio) => radio.value === "title-desc",
      )!;

      await user.click(titleDescRadio);
      expect(titleDescRadio.checked).toBe(true);

      // Close drawer by clicking close button
      const closeButton = screen.getByRole("button", { name: "Close filters" });
      await user.click(closeButton);

      // onSortChange should not have been called
      expect(onSortChange).not.toHaveBeenCalled();

      // Re-open drawer - original sort should be selected again
      await clickToggleFilters(user);
      radioButtons = container.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="sort"]',
      );
      const titleAscRadio = [...radioButtons].find(
        (radio) => radio.value === "title-asc",
      );
      expect(titleAscRadio?.checked).toBe(true);
    });
  });

  describe("applied filters", () => {
    it("does not render AppliedFilters when activeFilters prop is not provided", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      render(
        <FilterAndSortContainer {...mockProps}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      expect(screen.queryByText("Applied Filters")).not.toBeInTheDocument();
    });

    it("does not render AppliedFilters when activeFilters is empty", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onRemoveFilter = vi.fn();
      render(
        <FilterAndSortContainer
          {...mockProps}
          activeFilters={[]}
          onRemoveFilter={onRemoveFilter}
        >
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      expect(screen.queryByText("Applied Filters")).not.toBeInTheDocument();
    });

    it("renders AppliedFilters when activeFilters contains filters", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onRemoveFilter = vi.fn();
      const activeFilters: FilterChip[] = [
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
      ];

      render(
        <FilterAndSortContainer
          {...mockProps}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
        >
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      expect(screen.getByText("Applied Filters")).toBeInTheDocument();
      // Simple filters (Kind) show value only
      expect(screen.getByText("Novel")).toBeInTheDocument();
      expect(screen.getByText("Short Story")).toBeInTheDocument();
    });

    it("calls onRemoveFilter when a filter chip is removed", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onRemoveFilter = vi.fn();
      const activeFilters: FilterChip[] = [
        {
          category: "Kind",
          displayText: "Novel",
          id: "kind-novel",
          label: "Novel",
        },
      ];

      render(
        <FilterAndSortContainer
          {...mockProps}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
        >
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      // Simple filters (Kind) show value only: "Novel"
      const removeButton = screen.getByRole("button", {
        name: "Remove Novel filter",
      });
      await user.click(removeButton);

      expect(onRemoveFilter).toHaveBeenCalledWith("kind-novel");
    });

    it("calls onClearFilters when Clear all button is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const onRemoveFilter = vi.fn();
      const activeFilters: FilterChip[] = [
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
      ];

      render(
        <FilterAndSortContainer
          {...mockProps}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
        >
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      const clearAllButton = screen.getByRole("button", {
        name: "Clear all",
      });
      await user.click(clearAllButton);

      expect(mockProps.onClearFilters).toHaveBeenCalled();
    });

    it("does not render AppliedFilters when onRemoveFilter is not provided", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const activeFilters: FilterChip[] = [
        {
          category: "Kind",
          displayText: "Novel",
          id: "kind-novel",
          label: "Novel",
        },
      ];

      render(
        <FilterAndSortContainer {...mockProps} activeFilters={activeFilters}>
          <div>Test Content</div>
        </FilterAndSortContainer>,
      );

      await clickToggleFilters(user);

      expect(screen.queryByText("Applied Filters")).not.toBeInTheDocument();
    });
  });
});
