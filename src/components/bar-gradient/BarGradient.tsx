/**
 * Renders a progress bar with gradient styling based on a value relative to a maximum.
 * Creates a visual representation of progress using CSS custom properties for the percentage.
 *
 * @param props - The component props
 * @param props.maxValue - The maximum value for calculating percentage (100%)
 * @param props.value - The current value to display as a percentage of maxValue
 * @returns A JSX element containing a styled progress bar
 */
export function BarGradient({
  maxValue,
  value,
}: {
  maxValue: number;
  value: number;
}): React.JSX.Element {
  const styles = {
    "--bar-percent": `${(value / maxValue) * 100}%`,
  } as React.CSSProperties;

  return (
    <div
      className={`
        bg-progress-bar leading-[6px]
        tablet:mb-0
      `}
      style={styles}
    >
      &nbsp;
    </div>
  );
}
