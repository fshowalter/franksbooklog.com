import { createVar, globalStyle } from "@vanilla-extract/css";

const borderDefault = createVar();
const borderAccent = createVar();

const fgAccent = createVar();
const fgDefault = createVar();
const fgMuted = createVar();
const fgSubtle = createVar();
const fgInverse = createVar();
const fgEmphasis = createVar();

const bgAccent = createVar();
const bgDefault = createVar();
const bgCanvas = createVar();
const bgProgress = createVar();
const bgSubtle = createVar();
const bgInverse = createVar();
const bgStripe = createVar();

export const borderColors = {
  default: borderDefault,
  accent: borderAccent,
};

export const foregroundColors = {
  accent: fgAccent,
  default: fgDefault,
  muted: fgMuted,
  subtle: fgSubtle,
  inverse: fgInverse,
  inherit: "inherit",
  emphasis: fgEmphasis,
  progress: "#379634",
};

export const backgroundColors = {
  accent: bgAccent,
  canvas: bgCanvas,
  default: bgDefault,
  progress: bgProgress,
  subtle: bgSubtle,
  inverse: bgInverse,
  stripe: bgStripe,
};

globalStyle(":root", {
  vars: {
    [bgAccent]: "#0056b3",
    [bgCanvas]: "#f2f0e8",
    [bgDefault]: "#fff",
    [bgInverse]: "rgb(255 255 255 / 75%)",
    [bgProgress]: "#14bd41",
    [bgStripe]: "#f7f5f3",
    [bgSubtle]: "#fafafa",
    [borderAccent]: "#054a93",
    [borderDefault]: "#e9e7e0",
    [fgAccent]: "#7c5050",
    [fgDefault]: "rgb(0 0 0 / 75%)",
    [fgEmphasis]: "rgb(0 0 0 / 95%)",
    [fgInverse]: "rgb(255 255 255 / 75%)",
    [fgMuted]: "rgb(0 0 0 / 65%)",
    [fgSubtle]: "rgb(0 0 0 / 60%)",
  },
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: {
        [bgAccent]: "#0056b3",
        [bgCanvas]: "#484745",
        [bgDefault]: "#322f2f",
        [bgInverse]: "#322f2f",
        [bgProgress]: "#379634",
        [bgStripe]: "#3C393A",
        [bgSubtle]: "#373434",
        [borderAccent]: "#499ef8",
        [borderDefault]: "#484745",
        [fgAccent]: "#c86666",
        [fgDefault]: "rgb(255 255 255 / 75%)",
        [fgEmphasis]: "rgb(255 255 255 / 95%)",
        [fgMuted]: "rgb(255 255 255 / 65%)",
        [fgSubtle]: "rgb(255 255 255 / 60%)",
      },
    },
  },
});
