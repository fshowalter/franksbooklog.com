import type { CoverImageProps } from "~/api/covers";

/**
 * Renders a book cover with decorative spine and lighting effects.
 * Creates a realistic book appearance with multiple layers including spine textures,
 * lighting effects, and hover animations. Uses complex CSS layering to achieve
 * the book-like visual effect.
 *
 * @param props - The component props
 * @param props.className - Optional additional CSS classes
 * @param props.imageConfig - Configuration for responsive image sizing
 * @param props.imageProps - Image properties including src, alt text, etc.
 * @returns A JSX element containing the styled book cover with effects
 */
export function CoverListItemCover({
  className,
  imageConfig,
  imageProps,
}: {
  className?: string;
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  imageProps: CoverImageProps;
}): React.JSX.Element {
  return (
    <div
      className={`
        relative w-1/4 max-w-[250px] shrink-0 self-start overflow-hidden
        rounded-sm shadow-all transition-transform
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:bg-default after:opacity-15 after:transition-opacity
        group-has-[a:hover]/list-item:after:opacity-0
        ${className ?? "tablet:w-auto"}
      `}
    >
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-sticky after:block
          after:size-full after:rounded-[2.5px]
          after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
          after:mix-blend-multiply
        `}
      >
        <div
          className={`
            relative z-10
            before:absolute before:top-0 before:left-0 before:z-10 before:block
            before:size-full before:rounded-[2.5px]
            before:bg-[url(/assets/spine-light.png)] before:bg-size-[100%_100%]
            after:absolute after:top-0 after:left-0 after:block after:size-full
            after:rounded-[2.5px] after:bg-[url(/assets/spot.png)]
            after:bg-size-[100%_100%] after:mix-blend-soft-light
          `}
        >
          <img
            {...imageProps}
            alt=""
            {...imageConfig}
            className={`
              transform-gpu rounded-[2.5px] bg-default shadow-sm
              transition-transform duration-500
              group-has-[a:hover]/list-item:scale-110
              @min-[160px]:shadow-lg
            `}
            decoding="async"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
