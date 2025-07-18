import type { CoverImageProps } from "~/api/covers";

export const ListItemCoverImageConfig = {
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
  width: 80,
};

export function ListItemCover({ imageProps }: { imageProps: CoverImageProps }) {
  return (
    <div
      className={`
        relative w-list-item-cover shrink-0
        before:absolute before:top-0 before:left-0 before:block before:size-full
        before:bg-[url(/assets/spine-light.png)] before:bg-size-[100%_100%]
        after:absolute after:top-0 after:left-0 after:block after:size-full
        after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
        after:mix-blend-multiply
      `}
    >
      <img
        alt=""
        height={imageProps.height}
        src={imageProps.src}
        srcSet={imageProps.srcSet}
        {...ListItemCoverImageConfig}
        className="rounded-[2.5px]"
        decoding="async"
        loading="lazy"
        style={{ aspectRatio: imageProps.aspectRatio }}
      />
    </div>
  );
}
