import { style } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";

export const typographyStyle = style({
  fontSize: "2rem",
  fontWeight: "normal",
  lineHeight: "2.5rem",

  "@media": {
    [minMediaQuery("desktop")]: {
      fontSize: "2.25rem",
    },
  },
});
