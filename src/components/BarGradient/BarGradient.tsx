import React from "react";
import { Box, IBoxProps } from "../Box";
import { gradientBackgroundStyle } from "./BarGradient.css";

interface IBarGradientProps extends IBoxProps {
  value: number;
  maxValue: number;
}

export function BarGradient({
  value,
  maxValue,
  ...rest
}: IBarGradientProps): JSX.Element {
  const barPercentProperty = {
    "--bar-percent": `${(value / maxValue) * 100}%`,
  } as React.CSSProperties;

  return (
    <Box
      {...rest}
      className={gradientBackgroundStyle}
      style={barPercentProperty}
    >
      &nbsp;
    </Box>
  );
}
