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
  color = "inverse",
  href,
}: {
  children: React.ReactNode;
  color?: "default" | "inverse";
  href: string;
}) {
  return (
    <a
      className={`
        font-sans text-sm tracking-wide uppercase underline-offset-8
        ${
          color === "inverse"
            ? `
              text-inverse decoration-inverse-subtle decoration-2
              hover:underline
            `
            : `
              text-subtle
              hover:text-accent
            `
        }
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

  return (
    <p className="mb-2 font-sans text-sm tracking-wide text-subtle uppercase">
      {value}
    </p>
  );
}

function Deck({
  center,
  shadow,
  subtle,
  value,
}: {
  center?: boolean;
  shadow?: boolean;
  subtle?: boolean;
  value?: React.ReactNode;
}) {
  if (!value) {
    return false;
  }

  return (
    <p
      className={`
        mt-1 text-base
        desktop:my-4 desktop:text-xl
        ${center ? `text-center` : ""}
        ${shadow ? `[text-shadow:1px_1px_2px_black]` : ""}
        ${subtle ? `text-subtle` : ""}
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
          text-3xl font-bold tracking-widest uppercase
          tablet:text-4xl
          tablet-landscape:text-5xl
          desktop:text-7xl
        `
      }
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
    "min-h-[340px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,70vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[clamp(340px,50vh,1350px)]";

  const xsmallSizes = "min-h-[clamp(340px,40vh,1350px)]";

  const sizes =
    size === "large"
      ? largeSizes
      : size === "small"
        ? smallSizes
        : size === "xsmall"
          ? xsmallSizes
          : size === "auto"
            ? "min-h-[25vw]"
            : defaultSizes;

  return (
    <header
      className={`
        ${sizes}
        ${textInverse ? "text-inverse" : ""}
        ${heroImage ? "bg-[#000]" : "bg-canvas"}
        relative flex w-full flex-col content-start items-center justify-end
        gap-6 pt-20
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
