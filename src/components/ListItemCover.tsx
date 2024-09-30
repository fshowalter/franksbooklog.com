import type { CoverImageProps } from "src/api/covers";

export const ListItemCoverImageConfig = {
  width: 80,
  height: 113,
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
};

export function ListItemCover({ imageProps }: { imageProps: CoverImageProps }) {
  return (
    <div className="w-list-item-cover shrink-0">
      <img
        {...imageProps}
        alt=""
        {...ListItemCoverImageConfig}
        loading="lazy"
        decoding="async"
        className="aspect-cover"
      />
    </div>
  );
}
