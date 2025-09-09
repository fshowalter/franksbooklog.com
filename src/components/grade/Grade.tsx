import { gradeMap } from "./gradeMap";

/**
 * Displays a grade as star icons with light/dark theme support.
 * Returns false for abandoned or missing grades to conditionally render.
 * 
 * @param props - Component props
 * @param props.className - Optional CSS classes to apply
 * @param props.height - Height of the grade image in pixels
 * @param props.value - Grade value (e.g., "A+", "B-", etc.) 
 * @returns Grade component or false if no grade to display
 */
export function Grade({
  className,
  height,
  value,
}: {
  className?: string;
  height: 15 | 16 | 18 | 24 | 32;
  value?: string;
}): false | React.JSX.Element {
  if (!value || value == "Abandoned") {
    return false;
  }

  const [src, alt] = gradeMap[value];

  const width = height * 5;

  return (
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet={src.replace(".svg", "-dark.svg")}
      />
      <img
        alt={`${value}: ${alt}`}
        className={className}
        height={height}
        src={src}
        width={width}
      />
    </picture>
  );
}
