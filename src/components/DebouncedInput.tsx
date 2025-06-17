import type { JSX } from "react";

import { LabelText } from "./LabelText";

type onChangeHandler = (value: string) => void;

export function DebouncedInput({
  label,
  onInputChange,
  placeholder,
}: {
  label: string;
  onInputChange: onChangeHandler;
  placeholder: string;
}): JSX.Element {
  const debouncedHandleChange = underscoreDebounce(onInputChange, 150);

  return (
    <label className="flex flex-col text-subtle">
      <LabelText value={label} />
      <input
        className={`
          border-0 bg-default px-4 py-2 text-base text-default shadow-all
          placeholder:text-default placeholder:opacity-50
        `}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          debouncedHandleChange((e.target as HTMLInputElement).value)
        }
        placeholder={placeholder}
        type="text"
      />
    </label>
  );
}

/**
 * Wraps a given function in a setTimeout call with the given milliseconds.
 * @param func The function to wrap.
 * @param wait The number of milliseconds to wait before executing.
 * @param args The function args.
 */
function delay<F extends onChangeHandler>(
  func: F,
  wait: number,
  value: string,
): NodeJS.Timeout {
  return setTimeout(function delayWrap() {
    return func(value);
  }, wait);
}

/**
 * Debounce function lifted from underscore.js.
 * @param func The function to wrap.
 * @param wait The number of milliseconds to wait.
 */
function underscoreDebounce<F extends onChangeHandler>(
  func: F,
  wait: number,
): onChangeHandler {
  let timeout: NodeJS.Timeout | undefined;

  const later = function later(value: string) {
    timeout = undefined;
    func(value);
  };

  return function debouncedFunction(value: string): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = delay(later, wait, value);
  };
}
