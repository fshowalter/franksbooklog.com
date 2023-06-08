import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { minMediaQuery } from "../../styles/breakpoints";
import { borderColors, foregroundColors } from "../../styles/colors.css";
import { gridTemplate, SPACER } from "../../styles/grid";
import { pageMarginWidth, relativeSize, size } from "../../styles/sizes.css";

export const coverBorderStyle = style({
  border: `solid 8px ${borderColors.default}`,
});

export const excerptContinueReadingLinkStyle = style({
  color: foregroundColors.muted,
  fontSize: relativeSize[18],
  lineHeight: 1.5,
  letterSpacing: "0.3px",
});

globalStyle(`${excerptContinueReadingLinkStyle} a[data-continue-reading]`, {
  fontSize: relativeSize[14],
  lineHeight: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
});

export const gridStyle = style({
  display: "grid",
  margin: "0 auto",
  ...gridTemplate<GridAreas, 1>({
    rows: [
      { [size[40]]: SPACER },
      ["date"],
      { [size[24]]: SPACER },
      ["cover"],
      { [size[16]]: SPACER },
      { "1fr": ["excerpt"] },
      { [size[40]]: SPACER },
    ],
    columns: ["auto"],
  }),
  "@media": {
    [minMediaQuery("desktop")]: {
      width: "100%",
      ...gridTemplate<GridAreas, 5>({
        rows: [
          { [size[40]]: SPACER },
          ["date", SPACER, "cover", SPACER, "excerpt"],
          { "1fr": [SPACER, SPACER, "cover", SPACER, "excerpt"] },
          { [size[40]]: SPACER },
        ],
        columns: [
          "auto",
          "minmax(64px, 1fr)",
          "auto",
          "minmax(64px, 1fr)",
          "auto",
        ],
      }),
    },
  },
});

const gridAreaStyles = {
  cover: {
    gridArea: "cover",
    margin: "0 auto",
  },
  excerpt: {
    gridArea: "excerpt",
    maxWidth: "33rem",
    "@media": {
      [minMediaQuery("desktop")]: {
        maxWidth: "unset",
        paddingRight: pageMarginWidth,
      },
    },
  },
  date: {
    gridArea: "date",
    textAlign: "center" as const,
  },
};

export type GridAreas = "cover" | "excerpt" | "date";

export const gridAreas = styleVariants(gridAreaStyles);
