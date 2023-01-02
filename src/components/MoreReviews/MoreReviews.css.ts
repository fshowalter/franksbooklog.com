import { style } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";
import { gutterWidth, size } from "../../styles/sizes.css";

export const seeAllLinkStyle = style({
  gridColumn: "1 / -1",
  "@media": {
    [minMediaQuery("tablet")]: {
      position: "absolute",
      top: 0,
      right: gutterWidth,
    },
    [minMediaQuery("desktop")]: {
      right: 0,
    },
  },
});

export const gridStyle = style({
  padding: 0,
  "@media": {
    [minMediaQuery("tablet")]: {
      // padding: `0 ${gutterWidth}`,
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(78px, 248px))",
      columnGap: size[32],
      rowGap: size[32],
    },
    [minMediaQuery("desktop")]: {
      padding: `${size[8]} 0 0`,
      maxWidth: "unset",
      columnGap: size[64],
      gridTemplateColumns: "repeat(4,1fr)",
    },
  },
});
