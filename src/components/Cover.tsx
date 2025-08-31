import type { CoverImageProps } from "~/api/covers";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  decoding: "async" | "auto" | "sync";
  imageProps: CoverImageProps | undefined;
  loading: "eager" | "lazy";
};

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
