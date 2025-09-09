import type { CoverImageProps } from "~/api/covers";

/**
 * Props for the Cover component, extending standard HTML img attributes.
 */
type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Optional CSS classes to apply to the cover container */
  className?: string;
  /** Decoding strategy for the image */
  decoding: "async" | "auto" | "sync";
  /** Image properties if a cover image is available */
  imageProps: CoverImageProps | undefined;
  /** Loading strategy for the image */
  loading: "eager" | "lazy";
};

/**
 * Displays a book cover with realistic styling effects.
 * Adds spine gradients, spot lighting, and shadow effects to create
 * a three-dimensional book cover appearance.
 * 
 * @param props - Cover component props including image properties
 * @returns Cover component with styled book appearance
 */
export function Cover({
  className,
  imageProps,
  ...rest
}: Props): React.JSX.Element {
  return (
    <div
      className={`
        relative
        after:absolute after:top-0 after:left-0 after:z-20 after:block
        after:size-full after:rounded-[2.5px] after:bg-[url(/assets/spot.png)]
        after:bg-size-[100%_100%] after:mix-blend-soft-light
        ${className}
      `}
    >
      <div
        className={`
          relative z-10
          before:absolute before:top-0 before:left-0 before:z-10 before:block
          before:size-full before:rounded-[2.5px]
          before:bg-[url(/assets/spine-light.png)] before:bg-size-[100%_100%]
          after:absolute after:top-0 after:left-0 after:z-10 after:block
          after:size-full after:rounded-[2.5px]
          after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
          after:mix-blend-multiply
        `}
      >
        <img
          {...imageProps}
          {...rest}
          alt=""
          className={`
            rounded-[2.5px] bg-default shadow-sm
            @min-[160px]:shadow-lg
          `}
          loading="lazy"
        />
      </div>
    </div>
  );
}
