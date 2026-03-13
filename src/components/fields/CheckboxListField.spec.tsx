import type { ComponentProps } from "react";

import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import { CheckboxListField } from "./CheckboxListField";

type CheckboxListFieldOption = ComponentProps<
  typeof CheckboxListField
>["options"][number];

// Helper function to get checkbox by its label text
// Note: We use a regex pattern because the accessible name includes the count, e.g., "Action(10)"
const getCheckboxByLabel = (labelText: string): HTMLInputElement => {
  return screen.getByRole("checkbox", { name: new RegExp(`^${labelText}`) });
};

const queryCheckboxByLabel = (labelText: string): HTMLInputElement | null => {
  return screen.queryByRole("checkbox", { name: new RegExp(`^${labelText}`) });
};

const createDefaultProps = (
  overrides = {},
): {
  defaultValues?: string[];
  label: string;
  onChange: (values: string[]) => void;
  onClear?: () => void;
  options: CheckboxListFieldOption[];
  showMoreThreshold?: number;
} => ({
  label: "Test Label",
  onChange: vi.fn(),
  options: [
    { count: 10, label: "Action", value: "action" },
    { count: 15, label: "Comedy", value: "comedy" },
    { count: 8, label: "Drama", value: "drama" },
    { count: 12, label: "Horror", value: "horror" },
    { count: 5, label: "Romance", value: "romance" },
    { count: 20, label: "Sci-Fi", value: "sci-fi" },
    { count: 7, label: "Thriller", value: "thriller" },
  ],
  ...overrides,
});

describe("CheckboxListField", () => {
  describe("rendering", () => {
    it("renders all options when count <= threshold", ({ expect }) => {
      const props = createDefaultProps({
        options: [
          { count: 10, label: "Action", value: "action" },
          { count: 15, label: "Comedy", value: "comedy" },
          { count: 8, label: "Drama", value: "drama" },
        ],
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Comedy")).toBeInTheDocument();
      expect(screen.getByText("Drama")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();
    });

    it("shows limited options when count > threshold", ({ expect }) => {
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      // Should show first 3 alphabetically (Action, Comedy, Drama)
      expect(getCheckboxByLabel("Action")).toBeInTheDocument();
      expect(getCheckboxByLabel("Comedy")).toBeInTheDocument();
      expect(getCheckboxByLabel("Drama")).toBeInTheDocument();

      // Should not show others initially
      expect(queryCheckboxByLabel("Horror")).not.toBeInTheDocument();

      // Should show "Show more" button
      expect(
        screen.getByRole("button", { name: "Show more" }),
      ).toBeInTheDocument();
    });

    it("displays option counts", ({ expect }) => {
      const props = createDefaultProps({
        options: [{ count: 42, label: "Action", value: "action" }],
      });
      render(<CheckboxListField {...props} />);

      expect(screen.getByText("(42)")).toBeInTheDocument();
    });

    it("renders with default selected values", ({ expect }) => {
      const props = createDefaultProps({
        defaultValues: ["action", "horror"],
      });
      render(<CheckboxListField {...props} />);

      const actionCheckbox = getCheckboxByLabel("Action");
      const horrorCheckbox = getCheckboxByLabel("Horror");

      expect(actionCheckbox.checked).toBe(true);
      expect(horrorCheckbox.checked).toBe(true);
    });
  });

  describe("show more functionality", () => {
    it("expands to show all items when Show more is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      // Initially should not show Horror
      expect(queryCheckboxByLabel("Horror")).not.toBeInTheDocument();

      // Click Show more
      await user.click(screen.getByRole("button", { name: "Show more" }));

      // Should now show all options
      expect(getCheckboxByLabel("Horror")).toBeInTheDocument();
      expect(getCheckboxByLabel("Romance")).toBeInTheDocument();
      expect(getCheckboxByLabel("Sci-Fi")).toBeInTheDocument();
      expect(getCheckboxByLabel("Thriller")).toBeInTheDocument();
    });

    it("stays expanded after clicking Show more", async ({ expect }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      await user.click(screen.getByRole("button", { name: "Show more" }));

      // Show more button should be gone
      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();

      // All items should be visible
      expect(screen.getAllByRole("checkbox")).toHaveLength(7);
    });

    it("does not show Show more when all items are visible due to selections", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      // Select items that would normally be hidden
      await user.click(screen.getByRole("button", { name: "Show more" }));
      await user.click(getCheckboxByLabel("Horror"));
      await user.click(getCheckboxByLabel("Romance"));
      await user.click(getCheckboxByLabel("Sci-Fi"));
      await user.click(getCheckboxByLabel("Thriller"));

      // All 7 checkboxes should be visible (4 selected + 3 unselected visible)
      expect(screen.getAllByRole("checkbox")).toHaveLength(7);
    });
  });

  describe("selection behavior", () => {
    it("checks checkbox when clicked", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({ onChange });
      render(<CheckboxListField {...props} />);

      await user.click(getCheckboxByLabel("Action"));

      expect(onChange).toHaveBeenCalledExactlyOnceWith(["action"]);
      expect(getCheckboxByLabel("Action").checked).toBe(true);
    });

    it("unchecks checkbox when clicked again", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["action"],
        onChange,
      });
      render(<CheckboxListField {...props} />);

      await user.click(getCheckboxByLabel("Action"));

      expect(onChange).toHaveBeenCalledExactlyOnceWith([]);
      expect(getCheckboxByLabel("Action").checked).toBe(false);
    });

    it("allows multiple selections", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({ onChange });
      render(<CheckboxListField {...props} />);

      await user.click(getCheckboxByLabel("Action"));
      await user.click(getCheckboxByLabel("Comedy"));
      await user.click(getCheckboxByLabel("Drama"));

      expect(onChange).toHaveBeenNthCalledWith(1, ["action"]);
      expect(onChange).toHaveBeenNthCalledWith(2, ["action", "comedy"]);
      expect(onChange).toHaveBeenNthCalledWith(3, [
        "action",
        "comedy",
        "drama",
      ]);
    });

    it("toggles checkbox with Space key", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({ onChange });
      render(<CheckboxListField {...props} />);

      const checkbox = getCheckboxByLabel("Action");
      checkbox.focus();
      await user.keyboard(" ");

      expect(onChange).toHaveBeenCalledExactlyOnceWith(["action"]);
      expect(checkbox.checked).toBe(true);

      // Press space again to uncheck
      await user.keyboard(" ");

      expect(onChange).toHaveBeenLastCalledWith([]);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe("selection ordering", () => {
    it("moves checked items to top of list when show more is needed", ({
      expect,
    }) => {
      const props = createDefaultProps({
        defaultValues: ["horror"],
        showMoreThreshold: 3, // Show more needed (7 options > 3 threshold)
      });
      render(<CheckboxListField {...props} />);

      // Horror should be first (selected) when show more hasn't been clicked
      const checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("horror");
      expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
      // Followed by alphabetical unselected items
      expect((checkboxes[1] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("comedy");
    });

    it("shows selected items in reverse selection order when show more is needed", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3, // Show more needed (7 options > 3 threshold)
      });
      render(<CheckboxListField {...props} />);

      // Select in order: Action, Comedy, Drama
      await user.click(getCheckboxByLabel("Action"));
      await user.click(getCheckboxByLabel("Comedy"));
      await user.click(getCheckboxByLabel("Drama"));

      const checkboxes = screen.getAllByRole("checkbox");
      // Should be in reverse selection order (newest first) when show more hasn't been clicked
      expect((checkboxes[0] as HTMLInputElement).value).toBe("drama");
      expect((checkboxes[1] as HTMLInputElement).value).toBe("comedy");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("action");
    });

    it("returns unchecked items to alphabetical order when show more is needed", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["horror"],
        showMoreThreshold: 3, // Show more needed (7 options > 3 threshold)
      });
      render(<CheckboxListField {...props} />);

      // Horror should be first (selected) when show more hasn't been clicked
      let checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("horror");

      // Uncheck Horror
      await user.click(getCheckboxByLabel("Horror"));

      // Should return to alphabetical position - only first 3 visible now (no selections)
      checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
      expect((checkboxes[0] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[1] as HTMLInputElement).value).toBe("comedy");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("drama");
      // Horror is no longer visible (it's 4th alphabetically, but only 3 shown)
      expect(queryCheckboxByLabel("Horror")).not.toBeInTheDocument();
    });

    it("maintains alphabetical order after show more is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3, // Show more needed (7 options > 3 threshold)
      });
      render(<CheckboxListField {...props} />);

      // Click "Show more" to expand the list
      const showMoreButton = screen.getByRole("button", { name: /Show more/i });
      await user.click(showMoreButton);

      // Now select Horror (4th item alphabetically)
      await user.click(getCheckboxByLabel("Horror"));

      // Should remain in alphabetical order (not moved to top)
      const checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[1] as HTMLInputElement).value).toBe("comedy");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("drama");
      expect((checkboxes[3] as HTMLInputElement).value).toBe("horror");
      expect((checkboxes[3] as HTMLInputElement).checked).toBe(true);
    });

    it("does not re-sort when selections change after show more is clicked", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["horror"],
        showMoreThreshold: 3, // Show more needed (7 options > 3 threshold)
      });
      render(<CheckboxListField {...props} />);

      // Horror should be first (selected) initially
      let checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("horror");

      // Click "Show more" to expand the list
      const showMoreButton = screen.getByRole("button", { name: /Show more/i });
      await user.click(showMoreButton);

      // After show more, should be in alphabetical order
      checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[3] as HTMLInputElement).value).toBe("horror");
      expect((checkboxes[3] as HTMLInputElement).checked).toBe(true);

      // Uncheck Horror
      await user.click(getCheckboxByLabel("Horror"));

      // Should remain in alphabetical order (not re-sort)
      checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[3] as HTMLInputElement).value).toBe("horror");
      expect((checkboxes[3] as HTMLInputElement).checked).toBe(false);

      // Check Drama
      await user.click(getCheckboxByLabel("Drama"));

      // Should still remain in alphabetical order
      checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("action");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("drama");
      expect((checkboxes[2] as HTMLInputElement).checked).toBe(true);
    });
  });

  describe("clear functionality", () => {
    it("shows Clear link only when selections exist", async ({ expect }) => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<CheckboxListField {...props} />);

      // No selections initially
      expect(
        screen.queryByRole("button", { name: /Clear/i }),
      ).not.toBeInTheDocument();

      // Select an item
      await user.click(getCheckboxByLabel("Action"));

      // Clear link should now be visible
      expect(
        screen.getByRole("button", { name: /Clear/i }),
      ).toBeInTheDocument();
    });

    it("clears all selections when Clear is clicked", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["action", "comedy"],
        onChange,
      });
      render(<CheckboxListField {...props} />);

      await user.click(
        screen.getByRole("button", { name: "Clear all Test Label selections" }),
      );

      expect(onChange).toHaveBeenCalledExactlyOnceWith([]);
    });

    it("calls onClear callback when Clear is clicked", async ({ expect }) => {
      const onClear = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["action"],
        onClear,
      });
      render(<CheckboxListField {...props} />);

      await user.click(
        screen.getByRole("button", { name: "Clear all Test Label selections" }),
      );

      expect(onClear).toHaveBeenCalledOnce();
    });

    it("shows both Show more and Clear when both are applicable", async ({
      expect,
    }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["action"],
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      // Should show both links with separator
      expect(
        screen.getByRole("button", { name: "Show more" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear all Test Label selections" }),
      ).toBeInTheDocument();
      expect(screen.getByText("|")).toBeInTheDocument();

      // After expanding, only Clear should show
      await user.click(screen.getByRole("button", { name: "Show more" }));

      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear all Test Label selections" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("|")).not.toBeInTheDocument();
    });
  });

  describe("form reset behavior", () => {
    it("resets to default values when form is reset", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({
        defaultValues: ["action", "comedy"],
        onChange,
      });
      const { container } = render(
        <form>
          <CheckboxListField {...props} />
        </form>,
      );

      // Verify initial state
      expect(getCheckboxByLabel("Action").checked).toBe(true);
      expect(getCheckboxByLabel("Comedy").checked).toBe(true);

      // Select additional option
      await user.click(getCheckboxByLabel("Drama"));
      expect(onChange).toHaveBeenLastCalledWith(["action", "comedy", "drama"]);

      // Reset the form
      const form = container.querySelector("form");
      act(() => {
        form?.reset();
      });

      // Should reset to default values
      expect(getCheckboxByLabel("Action").checked).toBe(true);
      expect(getCheckboxByLabel("Comedy").checked).toBe(true);
      expect(getCheckboxByLabel("Drama").checked).toBe(false);
    });

    it("clears all selections when form is reset with no defaults", async ({
      expect,
    }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      const props = createDefaultProps({ onChange });
      const { container } = render(
        <form>
          <CheckboxListField {...props} />
        </form>,
      );

      // Select options
      await user.click(getCheckboxByLabel("Action"));
      await user.click(getCheckboxByLabel("Comedy"));

      expect(getCheckboxByLabel("Action").checked).toBe(true);
      expect(getCheckboxByLabel("Comedy").checked).toBe(true);

      // Reset the form
      const form = container.querySelector("form");
      act(() => {
        form?.reset();
      });

      // Should clear all selections
      expect(getCheckboxByLabel("Action").checked).toBe(false);
      expect(getCheckboxByLabel("Comedy").checked).toBe(false);
    });

    it("collapses expanded list when form is reset", async ({ expect }) => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      const { container } = render(
        <form>
          <CheckboxListField {...props} />
        </form>,
      );

      // Expand the list
      await user.click(screen.getByRole("button", { name: "Show more" }));
      expect(getCheckboxByLabel("Horror")).toBeInTheDocument();

      // Reset the form
      const form = container.querySelector("form");
      act(() => {
        form?.reset();
      });

      // Should collapse back to limited view
      expect(queryCheckboxByLabel("Horror")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Show more" }),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("uses fieldset and legend for grouping", ({ expect }) => {
      const props = createDefaultProps();
      const { container } = render(<CheckboxListField {...props} />);

      const fieldset = container.querySelector("fieldset");
      expect(fieldset).toBeInTheDocument();
      expect(fieldset?.tagName).toBe("FIELDSET");

      const legend = fieldset?.querySelector("legend");
      expect(legend).toBeInTheDocument();
    });

    it("provides accessible labels for checkboxes", ({ expect }) => {
      const props = createDefaultProps({
        options: [{ count: 10, label: "Action", value: "action" }],
      });
      render(<CheckboxListField {...props} />);

      const checkbox = getCheckboxByLabel("Action");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.tagName).toBe("INPUT");
      expect(checkbox.getAttribute("type")).toBe("checkbox");
    });

    it("announces selection count to screen readers", async ({ expect }) => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<CheckboxListField {...props} />);

      await user.click(getCheckboxByLabel("Action"));
      await user.click(getCheckboxByLabel("Comedy"));

      // Should have screen reader text for count
      const countText = screen.getByText("2 options selected");
      expect(countText).toBeInTheDocument();
      // AIDEV-NOTE: CSS class implementation is covered by snapshots
    });

    it("has proper ARIA attributes for Show more button", ({ expect }) => {
      const props = createDefaultProps({
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      const showMoreButton = screen.getByRole("button", {
        name: "Show more",
      });
      expect(showMoreButton).toHaveAttribute("aria-expanded", "false");
    });

    it("has aria-live region for dynamic updates", ({ expect }) => {
      const props = createDefaultProps();
      const { container } = render(<CheckboxListField {...props} />);

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe("custom threshold", () => {
    it("respects custom showMoreThreshold", ({ expect }) => {
      const props = createDefaultProps({
        showMoreThreshold: 5,
      });
      render(<CheckboxListField {...props} />);

      // Should show first 5 alphabetically
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(5);

      // Should show Show more for remaining 2
      expect(
        screen.getByRole("button", { name: "Show more" }),
      ).toBeInTheDocument();
    });

    it("shows all items when threshold is >= option count", ({ expect }) => {
      const props = createDefaultProps({
        showMoreThreshold: 10,
      });
      render(<CheckboxListField {...props} />);

      // Should show all 7 options
      expect(screen.getAllByRole("checkbox")).toHaveLength(7);

      // Should not show Show more
      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles empty options array", ({ expect }) => {
      const props = createDefaultProps({
        options: [],
      });
      render(<CheckboxListField {...props} />);

      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();
    });

    it("handles single option", ({ expect }) => {
      const props = createDefaultProps({
        options: [{ count: 10, label: "Action", value: "action" }],
      });
      render(<CheckboxListField {...props} />);

      expect(getCheckboxByLabel("Action")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Show more/i }),
      ).not.toBeInTheDocument();
    });

    it("keeps selected items visible even when beyond threshold", ({
      expect,
    }) => {
      const props = createDefaultProps({
        defaultValues: ["thriller"], // Thriller is last alphabetically, beyond threshold
        showMoreThreshold: 3,
      });
      render(<CheckboxListField {...props} />);

      // Thriller should be visible even though it's beyond the threshold
      // because it's selected (selected items always show)
      const checkboxes = screen.getAllByRole("checkbox");
      expect((checkboxes[0] as HTMLInputElement).value).toBe("thriller");

      // Should show 4 items total: 1 selected (Thriller) + 3 unselected (Action, Comedy, Drama)
      expect(checkboxes).toHaveLength(4);
    });
  });
});
