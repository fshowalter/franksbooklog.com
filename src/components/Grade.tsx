const gradeMap: Record<string, [string, string]> = {
  A: ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A+": ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A-": ["/svg/4-half-stars.svg", "4.5 stars (out of 5)"],
  B: ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B+": ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B-": ["/svg/3-half-stars.svg", "3.5 stars (out of 5)"],
  C: ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C+": ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C-": ["/svg/2-half-stars.svg", "2.5 stars (out of 5)"],
  D: ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D+": ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D-": ["/svg/1-half-stars.svg", "1.5 stars (out of 5)"],
  F: ["/svg/1-star.svg", "1 star (out of 5)"],
};

export function fileForGrade(value: string) {
  if (!value || value == "Abandoned") {
    return;
  }

  const [src] = gradeMap[value];

  return src;
}

export function Grade({
  className,
  height,
  value,
}: {
  className?: string;
  height: 15 | 16 | 18 | 24 | 32;
  value?: string;
}) {
  if (!value || value == "Abandoned") {
    return;
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
