import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { Avatar } from "./Avatar";

export function AvatarBackdrop({
  avatarImageProps,
  backdropImageProps,
  breadcrumb,
  deck,
  name,
}: {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  name: string;
}) {
  const heroImage = (
    <img
      className={`
        absolute inset-0 size-full object-cover object-top text-inverse blur-xs
      `}
      {...backdropImageProps}
      {...BackdropImageConfig}
      alt=""
      fetchPriority="high"
      loading="eager"
    />
  );

  return (
    <Wrapper
      centerText={true}
      heroImage={heroImage}
      size="auto"
      textInverse={true}
    >
      {avatarImageProps && (
        <div
          className={`
            mx-auto mt-4 mb-6 w-4/5 max-w-[250px] transform-gpu overflow-hidden
            ${avatarImageProps && "rounded-full shadow-all"}
          `}
        >
          <Avatar
            data-pagefind-meta="image[src]"
            decoding="async"
            height={250}
            imageProps={avatarImageProps}
            loading="lazy"
            width={250}
          />
        </div>
      )}
      <Breadcrumb value={breadcrumb} />
      <Title center={true} value={name} />
      <Deck center={true} value={deck} />
    </Wrapper>
  );
}

export function BreadcrumbLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className={`
        relative inline-block font-sans text-sm tracking-wide uppercase
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full
        after:origin-center after:scale-x-0 after:bg-(--fg-inverse)/75
        after:transition-transform
        hover:after:scale-x-100
      `}
      href={href}
    >
      {children}
    </a>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return false;
  }

  return <p className="mb-2">{value}</p>;
}

function Deck({
  center,
  shadow,
  value,
}: {
  center?: boolean;
  shadow: boolean;
  value?: React.ReactNode;
}) {
  if (!value) {
    return false;
  }

  return (
    <p
      className={`
        mt-1 text-base
        laptop:my-4 laptop:text-xl
        ${shadow ? `[text-shadow:1px_1px_2px_black]` : ""}
        ${center ? `text-center` : ""}
      `}
    >
      {value}
    </p>
  );
}

function Title({
  center,
  className,
  value,
}: {
  center?: boolean;
  className?: string;
  value: string;
}) {
  return (
    <h1
      className={
        className ||
        `
          font-sans
          ${center ? "text-center" : ""}
          text-2xl font-bold tracking-widest uppercase
          laptop:text-7xl
        `
      }
      data-pagefind-weight="10"
    >
      {value}
    </h1>
  );
}

function Wrapper({
  centerText = false,
  children,
  heroImage,
  narrowChildren = false,
  size = "default",
  textInverse = false,
}: {
  centerText?: boolean;
  children: React.ReactNode;
  heroImage?: React.ReactNode;
  narrowChildren?: boolean;
  size?: "auto" | "default" | "large" | "small" | "xsmall";
  textInverse?: boolean;
}) {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] laptop:min-h-[clamp(640px,70vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[240px] laptop:min-h-[clamp(640px,50vh,1350px)]";

  const sizes =
    size === "large"
      ? largeSizes
      : size === "small"
        ? smallSizes
        : defaultSizes;

  return (
    <header
      className={`
        ${sizes}
        ${textInverse ? "text-inverse" : ""}
        ${heroImage ? "bg-[#000]" : "bg-canvas"}
        relative flex w-full flex-col content-start items-center justify-end
        gap-6 overflow-hidden pt-20
        laptop:pt-24
      `}
    >
      {heroImage}
      <div
        className={`
          ${centerText ? "items-center" : ""}
          z-10 mx-auto flex w-full
          ${
            narrowChildren
              ? `
                px-container text-center
                tablet:max-w-none tablet:px-0
              `
              : `max-w-(--breakpoint-desktop) px-container`
          }
          flex-col
          ${
            heroImage
              ? `
                after:absolute after:top-0 after:left-0 after:-z-10 after:h-full
                after:w-full after:bg-linear-to-t after:from-[rgba(0,0,0,.85)]
                after:to-50%
                tablet:after:to-25%
              `
              : ""
          }
          py-8
          tablet:pb-10
          laptop:pt-10
          desktop:pt-20
        `}
      >
        {children}
      </div>
    </header>
  );
}

export const BackdropImageConfig = {
  height: 1350,
  sizes: "100vw",
  width: 2400,
};

export function Backdrop({
  blur = false,
  breadcrumb,
  centerText = false,
  deck,
  imageProps,
  size = "default",
  title,
  titleClasses,
}: {
  blur?: boolean;
  breadcrumb?: React.ReactNode;
  centerText?: boolean;
  deck?: React.ReactNode;
  imageProps: BackdropImageProps;
  size?: "default" | "large" | "small";
  title: string;
  titleClasses?: string;
}) {
  const heroImage = (
    <img
      className={`
        absolute inset-0 size-full object-cover object-top
        ${blur && `blur-xs`}
      `}
      {...imageProps}
      {...BackdropImageConfig}
      alt=""
      fetchPriority="high"
      loading="eager"
    />
  );

  return (
    <Wrapper
      heroImage={heroImage}
      narrowChildren={centerText}
      size={size}
      textInverse={true}
    >
      <Breadcrumb value={breadcrumb} />
      <Title className={titleClasses} value={title} />
      <Deck shadow={true} value={deck} />
    </Wrapper>
  );
}
