import type { CoverImageProps } from "~/api/covers";

import { Cover } from "./Cover";

export const ListItemCoverImageConfig = {
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
  width: 80,
};

export function ListItemCover({ imageProps }: { imageProps: CoverImageProps }) {
  return (
    <Cover
      decoding="async"
      imageProps={imageProps}
      {...ListItemCoverImageConfig}
      alt=""
      className="w-list-item-cover shrink-0"
      loading="lazy"
    />
  );
}
