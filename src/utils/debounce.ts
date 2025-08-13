// Type for onChange handlers commonly used in the app
export type OnChangeHandler = (value: string) => void;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns Returns the new debounced function.
 */
export function debounce<Args extends unknown[], R>(
  func: (...args: Args) => R,
  wait: number,
): (...args: Args) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function debounced(...args: Args): void {
    const later = () => {
      timeout = undefined;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
