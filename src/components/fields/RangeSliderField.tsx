import type { ChangeEvent, KeyboardEvent } from "react";

import { useEffect, useRef, useState } from "react";

export type FormatValueFunction = (value: number) => string;

type RangeSliderFieldProps = {
  formatValue?: FormatValueFunction;
  fromValue: number;
  label: string;
  max: number;
  min: number;
  onChange: (from: number, to: number) => void;
  onClear?: () => void;
  toValue: number;
};

/**
 * Dual-handle range slider for selecting numeric ranges with optional value formatting.
 * Syncs with external from/to values and provides clear functionality.
 * @param props - Component props
 * @param props.formatValue - Optional formatter for displaying values (e.g., grade letters)
 * @param props.fromValue - Current "from" value (controlled)
 * @param props.label - Field label text
 * @param props.max - Maximum value
 * @param props.min - Minimum value
 * @param props.onChange - Handler for range changes
 * @param props.onClear - Handler for clear action (resets to full range)
 * @param props.toValue - Current "to" value (controlled)
 * @returns Dual-handle range slider with clear functionality
 */
export function RangeSliderField({
  formatValue = (value: number): string => value.toString(),
  fromValue,
  label,
  max,
  min,
  onChange,
  onClear,
  toValue,
}: RangeSliderFieldProps): React.JSX.Element {
  const [isDraggingFrom, setIsDraggingFrom] = useState(false);
  const [isDraggingTo, setIsDraggingTo] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isFullRange = fromValue === min && toValue === max;

  // AIDEV-NOTE: Calculate percentage positions for visual display
  const fromPercent = ((fromValue - min) / (max - min)) * 100;
  const toPercent = ((toValue - min) / (max - min)) * 100;

  const handleFromChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newFrom = Number.parseInt(e.target.value, 10);
    // Ensure from doesn't exceed to
    if (newFrom <= toValue) {
      onChange(newFrom, toValue);
    } else {
      onChange(toValue, newFrom);
    }
  };

  const handleToChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newTo = Number.parseInt(e.target.value, 10);
    // Ensure to doesn't go below from
    if (newTo >= fromValue) {
      onChange(fromValue, newTo);
    } else {
      onChange(newTo, fromValue);
    }
  };

  const handleClear = (): void => {
    onChange(min, max);
    if (onClear) {
      onClear();
    }
  };

  // AIDEV-NOTE: Keyboard navigation for range inputs
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    type: "from" | "to",
  ): void => {
    const step = Math.max(1, Math.floor((max - min) / 20)); // 5% steps
    const currentValue = type === "from" ? fromValue : toValue;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.max(min, currentValue - step);
      if (type === "from") {
        onChange(Math.min(newValue, toValue), toValue);
      } else {
        onChange(fromValue, Math.max(newValue, fromValue));
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.min(max, currentValue + step);
      if (type === "from") {
        onChange(Math.min(newValue, toValue), toValue);
      } else {
        onChange(fromValue, Math.max(newValue, fromValue));
      }
    }
  };

  // AIDEV-NOTE: Update dragging state for visual feedback
  useEffect(() => {
    const handleMouseUp = (): void => {
      setIsDraggingFrom(false);
      setIsDraggingTo(false);
    };

    if (isDraggingFrom || isDraggingTo) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);

      return (): void => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDraggingFrom, isDraggingTo]);

  const fieldsetId = `range-slider-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;

  return (
    <div className="text-left">
      <div className="flex flex-col gap-4 px-2 py-3">
        {/* Slider container */}
        <div className="relative h-6" ref={sliderRef}>
          {/* Track background */}
          <div
            className={`
              absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full
              bg-stripe
            `}
          />

          {/* Active range highlight */}
          <div
            className={`
              absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent
            `}
            style={{
              left: `${fromPercent}%`,
              right: `${100 - toPercent}%`,
            }}
          />

          {/* From handle (lower value) */}
          <input
            aria-label={`${label} minimum value`}
            aria-valuemax={toValue}
            aria-valuemin={min}
            aria-valuenow={fromValue}
            aria-valuetext={formatValue(fromValue)}
            className="range-input"
            id={`${fieldsetId}-from`}
            max={max}
            min={min}
            onChange={handleFromChange}
            onKeyDown={(e) => handleKeyDown(e, "from")}
            onMouseDown={() => setIsDraggingFrom(true)}
            onTouchStart={() => setIsDraggingFrom(true)}
            type="range"
            value={fromValue}
          />

          {/* To handle (upper value) */}
          <input
            aria-label={`${label} maximum value`}
            aria-valuemax={max}
            aria-valuemin={fromValue}
            aria-valuenow={toValue}
            aria-valuetext={formatValue(toValue)}
            className="range-input"
            id={`${fieldsetId}-to`}
            max={max}
            min={min}
            onChange={handleToChange}
            onKeyDown={(e) => handleKeyDown(e, "to")}
            onMouseDown={() => setIsDraggingTo(true)}
            onTouchStart={() => setIsDraggingTo(true)}
            type="range"
            value={toValue}
          />
        </div>

        {/* Clear link */}
        {!isFullRange && (
          <div className="pt-1">
            <button
              aria-label={`Reset ${label} to full range`}
              className={`font-sans text-sm text-accent underline`}
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Screen reader announcement */}
      <div aria-atomic="true" aria-live="polite" className="sr-only">
        Range: {formatValue(fromValue)} to {formatValue(toValue)}
      </div>
    </div>
  );
}
