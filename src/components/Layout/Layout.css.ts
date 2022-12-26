import { style } from "@vanilla-extract/css";
import { breakpoints, minMediaQuery } from "../../styles/breakpoints";

export const pageCanvasStyle = style({
  minHeight: "100dvh",
  maxWidth: `clamp(960px, 95vw, ${breakpoints.desktop})`,
  margin: "0 auto",
});

export const bandStickyStyle = style({
  maxWidth: `clamp(960px, 95vw, ${breakpoints.desktop})`,
  margin: "0 auto",

  "@media": {
    [minMediaQuery("desktop")]: {
      position: "sticky",
      top: "0",
      zIndex: 1000,
    },
  },
});

export const headerLayoutStyle = style({
  flexDirection: "column",
  textAlign: "center",

  "@media": {
    [minMediaQuery("desktop")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "left",
      position: "sticky",
      top: "16px",
      zIndex: 1000,
    },
  },
});

export const skipToMainContentStyle = style({
  left: "50%",
  margin: "0 auto",
  position: "absolute",
  top: "2px",
  transform: "translate(-50%, calc(-100% - 2px))",
  zIndex: 10000,

  [":focus"]: {
    transform: "translate(-50%, 0%)",
  },
});
