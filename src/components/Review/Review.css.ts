import { globalStyle, style } from "@vanilla-extract/css";

export const coverStyle = style({
  position: "relative",
  zIndex: "1",
  top: "-16px",
  height: "372px",
  overflow: "unset !important",
  boxShadow: "0 5px 20px rgba(49, 46, 42, 0.22)",
});

globalStyle(`${coverStyle} img`, {
  height: "unset !important",
  boxShadow: "0 5px 20px rgba(49, 46, 42, 0.22)",
});

export const coverBackgroundWrapStyle = style({
  position: "absolute",
  left: "0",
  right: "0",
  top: "0",
  bottom: "0",
  overflow: "hidden",
});

export const coverBackgroundImageStyle = style({
  width: "110%",
  height: "110%",
  left: "-5%",
  top: "-5%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "absolute",
});

export const coverBackgroundBlurStyle = style({
  position: "absolute",
  width: "100%",
  height: "100%",
  backdropFilter: "blur(8px)",
});
