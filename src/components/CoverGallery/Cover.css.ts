import { style } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";
import { POSTER_WIDTH, relativeSize } from "../../styles/sizes.css";

export const slugTypographyStyle = style({
  fontSize: ".875rem",
  lineHeight: "1rem",
  letterSpacing: "0.5px",

  "@media": {
    [minMediaQuery("tablet")]: {
      fontSize: "0.75rem",
      textAlign: "center",
    },
  },
});

export const authorsTypographyStyle = style({
  fontSize: "1rem",
  lineHeight: "1.5rem",

  "@media": {
    [minMediaQuery("tablet")]: {
      fontSize: ".875rem",
      lineHeight: "1.25rem",
      textAlign: "center",
    },
  },
});

export const titleTypographyStyle = style({
  fontSize: relativeSize[18],
  lineHeight: "1.5rem",

  "@media": {
    [minMediaQuery("tablet")]: {
      fontSize: "1rem",
      lineHeight: "1.25rem",
      textAlign: "center",
    },
  },
});

export const posterStyle = style({
  borderRadius: 0,
  minWidth: "80px",
  maxWidth: "80px",

  "@media": {
    [minMediaQuery("tablet")]: {
      maxWidth: POSTER_WIDTH,
    },
  },
});
