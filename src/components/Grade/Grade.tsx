/**
 * Maps grade letters to their letter and alt-text.
 */
const gradeMap: Record<string, [string, string]> = {
  A: ["/svg/5-stars.svg", "5 stars (out of 5)"],
  B: ["/svg/4-stars.svg", "4 stars (out of 5)"],
  C: ["/svg/3-stars.svg", "3 stars (out of 5)"],
  D: ["/svg/2-stars.svg", "2 stars (out of 5)"],
  F: ["/svg/1-star.svg", "1 star (out of 5)"],
};

export function Grade({
  grade,
  height,
  className,
}: {
  grade: string | null;
  height: 32 | 24 | 16 | 18;
  className?: string;
}): JSX.Element | null {
  if (!grade || grade == "Abandoned") {
    return null;
  }

  const [src, alt] = gradeMap[grade[0]];

  const width = height * 5;

  return (
    <img
      src={src}
      alt={`${grade}: ${alt}`}
      height={height}
      width={width}
      className={className}
    />
  );
}
