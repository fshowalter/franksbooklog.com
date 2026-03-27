import type { GradeType } from "~/utils/grades";

import { gradeMap } from "~/utils/gradeMap";

export function Grade({
  className,
  height,
  value,
}: {
  className?: string;
  height: 15 | 16 | 18 | 24 | 32;
  value?: GradeType;
}): React.JSX.Element | undefined {
  if (!value || value === "Abandoned") {
    return undefined;
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
