import React from "react";

export function BarGradient({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}): JSX.Element {
  const styles = {
    "--bar-percent": `${(value / maxValue) * 100}%`,
  } as React.CSSProperties;

  return (
    <div className="progress-bar-bg leading-[6px] tablet:mb-0" style={styles}>
      &nbsp;
    </div>
  );
}
