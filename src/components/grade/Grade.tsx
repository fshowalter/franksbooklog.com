import type { GradeText } from "~/utils/grades";

import { GRADE_SVG_MAP } from "~/utils/grades";

export function Grade({
  className,
  height,
  value,
}: {
  className?: string;
  height: 15 | 16 | 18 | 24 | 32;
  value?: GradeText;
}): React.JSX.Element | undefined {
  if (!value || value === "Abandoned") {
    return undefined;
  }

  const { altText, src } = GRADE_SVG_MAP[value];

  const width = height * 5;

  return (
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet={src.replace(".svg", "-dark.svg")}
      />
      <img
        alt={`${value}: ${altText}`}
        className={className}
        height={height}
        src={src}
        width={width}
      />
    </picture>
  );
}
