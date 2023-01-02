import { style } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";
import { size } from "../../styles/sizes.css";

export const maxWidthStyle = style({
  maxWidth: size[992],

  "@media": {
    [minMediaQuery("desktop")]: {
      maxWidth: size[992],
    },
  },
});
