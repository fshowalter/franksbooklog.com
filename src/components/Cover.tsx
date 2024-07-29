import React from "react";
import type { CoverImageProps } from "src/api/covers";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageProps: CoverImageProps | null;
  width: number;
  height: number;
  loading: "lazy" | "eager";
  decoding: "async" | "auto" | "sync";
}

export function Cover({
  imageProps,
  loading = "lazy",
  decoding = "async",
  ...rest
}: Props): JSX.Element {
  return (
    <img
      {...imageProps}
      {...rest}
      loading={loading}
      decoding={decoding}
      style={{ aspectRatio: "0.66666667" }}
    />
  );
}
