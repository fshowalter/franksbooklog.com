import type { CoverImageProps } from "~/api/covers";

export const ListItemCoverImageConfig = {
  height: 113,
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
  width: 80,
};

export function ListItemCover({ imageProps }: { imageProps: CoverImageProps }) {
  return (
    <div className="w-list-item-cover shrink-0">
      <img
        {...imageProps}
        alt=""
        {...ListItemCoverImageConfig}
        className="aspect-cover"
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
