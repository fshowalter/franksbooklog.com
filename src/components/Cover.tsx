import React, { type JSX } from "react";

import type { CoverImageProps } from "~/api/covers";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  decoding: "async" | "auto" | "sync";
  imageProps: CoverImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
};

export function Cover({
  decoding = "async",
  imageProps,
  loading = "lazy",
  ...rest
}: Props): JSX.Element {
  return (
    <img
      {...imageProps}
      {...rest}
      alt=""
      decoding={decoding}
      loading={loading}
      style={{ aspectRatio: imageProps?.aspectRatio }}
    />
  );
}
