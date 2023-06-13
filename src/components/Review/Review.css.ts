import { style } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";
import { borderColors } from "../../styles/colors.css";

export const desktopMarginStyle = style({
  "@media": {
    [minMediaQuery("desktop")]: {
      position: "relative",
      marginLeft: "232px",
    },
  },
});

export const coverStyle = style({
  border: `solid 8px ${borderColors.default}`,
  // boxShadow: "0 5px 20px rgba(49, 46, 42, 0.22)",
  borderRadius: "2px",
  overflow: "hidden",

  "@media": {
    [minMediaQuery("desktop")]: {
      position: "absolute",
      left: "-232px",
    },
  },
});
