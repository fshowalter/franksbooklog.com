import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import type { FormatValueFunction } from "./RangeSliderField";

import { RangeSliderField } from "./RangeSliderField";

const formatGrade: FormatValueFunction = (value: number): string => {
  const grades = [
    "F",
    "D-",
    "D",
    "D+",
    "C-",
    "C",
    "C+",
    "B-",
    "B",
    "B+",
    "A-",
    "A",
    "A+",
  ];
  return grades[value - 1] || "?";
};

const createDefaultProps = (
  overrides = {},
): {
  formatValue?: FormatValueFunction;
  fromValue: number;
  label: string;
  max: number;
  min: number;
  onChange: (from: number, to: number) => void;
  onClear?: () => void;
  toValue: number;
} => ({
  fromValue: 1920,
  label: "Release Year",
  max: 2026,
  min: 1920,
  onChange: vi.fn(),
  toValue: 2026,
  ...overrides,
});

describe("RangeSliderField", () => {
  describe("rendering", () => {
    it("renders with correct min and max values", ({ expect }) => {
      const props = createDefaultProps();
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");
      const maxSlider = screen.getByLabelText("Release Year maximum value");

      expect(minSlider).toHaveAttribute("min", "1920");
      expect(minSlider).toHaveAttribute("max", "2026");
      expect(maxSlider).toHaveAttribute("min", "1920");
      expect(maxSlider).toHaveAttribute("max", "2026");
    });

    it("displays current from/to values", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1980,
        toValue: 1989,
      });
      render(<RangeSliderField {...props} />);

      expect(screen.getByText(/Range: 1980 to 1989/)).toBeInTheDocument();
    });

    it("uses formatValue function when provided", ({ expect }) => {
      const props = createDefaultProps({
        formatValue: formatGrade,
        fromValue: 8,
        max: 13,
        min: 1,
        toValue: 11,
      });
      render(<RangeSliderField {...props} />);

      expect(screen.getByText(/Range: B- to A-/)).toBeInTheDocument();
    });

    it("does not show Clear link when range is full", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1920,
        toValue: 2026,
      });
      render(<RangeSliderField {...props} />);

      expect(
        screen.queryByRole("button", { name: /Reset .* to full range/i }),
      ).not.toBeInTheDocument();
    });

    it("shows Clear link when range is not full (from changed)", ({
      expect,
    }) => {
      const props = createDefaultProps({
        fromValue: 1980,
        toValue: 2026,
      });
      render(<RangeSliderField {...props} />);

      expect(
        screen.getByRole("button", {
          name: "Reset Release Year to full range",
        }),
      ).toBeInTheDocument();
    });

    it("shows Clear link when range is not full (to changed)", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1920,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      expect(
        screen.getByRole("button", {
          name: "Reset Release Year to full range",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("calls onChange when from slider changes", ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({ onChange });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");

      fireEvent.change(minSlider, { target: { value: "1980" } });

      expect(onChange).toHaveBeenCalledWith(1980, 2026);
    });

    it("calls onChange when to slider changes", ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({ onChange });
      render(<RangeSliderField {...props} />);

      const maxSlider = screen.getByLabelText("Release Year maximum value");

      fireEvent.change(maxSlider, { target: { value: "2000" } });

      expect(onChange).toHaveBeenCalledWith(1920, 2000);
    });

    it("swaps values when from exceeds to", ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");

      fireEvent.change(minSlider, { target: { value: "2010" } });

      // Should swap: from was higher than to, so swap them
      expect(onChange).toHaveBeenCalledWith(2000, 2010);
    });

    it("swaps values when to goes below from", ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const maxSlider = screen.getByLabelText("Release Year maximum value");

      fireEvent.change(maxSlider, { target: { value: "1970" } });

      // Should swap: to was lower than from, so swap them
      expect(onChange).toHaveBeenCalledWith(1970, 1980);
    });

    it("calls onClear when Clear button clicked", async ({ expect }) => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        onClear,
        toValue: 1989,
      });
      render(<RangeSliderField {...props} />);

      const clearButton = screen.getByRole("button", {
        name: "Reset Release Year to full range",
      });

      await act(async () => {
        await userEvent.click(clearButton);
      });

      expect(onChange).toHaveBeenCalledWith(1920, 2026);
      expect(onClear).toHaveBeenCalledOnce();
    });

    it("resets to full range when Clear clicked (without onClear callback)", async ({
      expect,
    }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 1989,
      });
      render(<RangeSliderField {...props} />);

      const clearButton = screen.getByRole("button", {
        name: "Reset Release Year to full range",
      });

      await act(async () => {
        await userEvent.click(clearButton);
      });

      expect(onChange).toHaveBeenCalledWith(1920, 2026);
    });
  });

  describe("keyboard navigation", () => {
    it("adjusts from value with arrow keys", async ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");
      minSlider.focus();

      await act(async () => {
        await userEvent.keyboard("{ArrowRight}");
      });

      // Should increase by step (5% of range = ~5 years)
      expect(onChange).toHaveBeenCalled();
      const [from, to] = onChange.mock.calls[0] as [number, number];
      expect(from).toBeGreaterThan(1980);
      expect(to).toBe(2000);
    });

    it("adjusts to value with arrow keys", async ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const maxSlider = screen.getByLabelText("Release Year maximum value");
      maxSlider.focus();

      await act(async () => {
        await userEvent.keyboard("{ArrowLeft}");
      });

      // Should decrease by step
      expect(onChange).toHaveBeenCalled();
      const [from, to] = onChange.mock.calls[0] as [number, number];
      expect(from).toBe(1980);
      expect(to).toBeLessThan(2000);
    });

    it("respects min boundary when decreasing from value", async ({
      expect,
    }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1920,
        onChange,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");
      minSlider.focus();

      await act(async () => {
        await userEvent.keyboard("{ArrowDown}");
      });

      // Should not go below min
      expect(onChange).toHaveBeenCalledWith(1920, 2000);
    });

    it("respects max boundary when increasing to value", async ({ expect }) => {
      const onChange = vi.fn();
      const props = createDefaultProps({
        fromValue: 1980,
        onChange,
        toValue: 2026,
      });
      render(<RangeSliderField {...props} />);

      const maxSlider = screen.getByLabelText("Release Year maximum value");
      maxSlider.focus();

      await act(async () => {
        await userEvent.keyboard("{ArrowUp}");
      });

      // Should not go above max
      expect(onChange).toHaveBeenCalledWith(1980, 2026);
    });
  });

  describe("accessibility", () => {
    it("has proper ARIA attributes for from slider", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1980,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");

      expect(minSlider).toHaveAttribute("aria-valuemin", "1920");
      expect(minSlider).toHaveAttribute("aria-valuemax", "2000");
      expect(minSlider).toHaveAttribute("aria-valuenow", "1980");
      expect(minSlider).toHaveAttribute("aria-valuetext", "1980");
    });

    it("has proper ARIA attributes for to slider", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1980,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      const maxSlider = screen.getByLabelText("Release Year maximum value");

      expect(maxSlider).toHaveAttribute("aria-valuemin", "1980");
      expect(maxSlider).toHaveAttribute("aria-valuemax", "2026");
      expect(maxSlider).toHaveAttribute("aria-valuenow", "2000");
      expect(maxSlider).toHaveAttribute("aria-valuetext", "2000");
    });

    it("uses formatted values in aria-valuetext", ({ expect }) => {
      const props = createDefaultProps({
        formatValue: formatGrade,
        fromValue: 8,
        max: 13,
        min: 1,
        toValue: 11,
      });
      render(<RangeSliderField {...props} />);

      const minSlider = screen.getByLabelText("Release Year minimum value");
      const maxSlider = screen.getByLabelText("Release Year maximum value");

      expect(minSlider).toHaveAttribute("aria-valuetext", "B-");
      expect(maxSlider).toHaveAttribute("aria-valuetext", "A-");
    });

    it("announces range changes to screen readers", ({ expect }) => {
      const props = createDefaultProps({
        fromValue: 1980,
        toValue: 2000,
      });
      render(<RangeSliderField {...props} />);

      // Should have aria-live region for announcements
      const announcement = screen.getByText("Range: 1980 to 2000");
      expect(announcement).toHaveAttribute("aria-live", "polite");
      expect(announcement).toHaveAttribute("aria-atomic", "true");
    });
  });
});
