import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { Avatar } from "./Avatar";

export function AvatarBackdrop({
  avatarImageProps,
  breadcrumb,
  deck,
  name,
}: {
  avatarImageProps: AvatarImageProps | undefined;
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  name: string;
}) {
  return (
    <Wrapper centerText={true} size="small">
      <Breadcrumb value={breadcrumb} />
      <div
        className={`
          mx-auto mb-6 w-4/5 max-w-[250px] safari-border-radius-fix
          overflow-hidden rounded-full
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
      <Title center={true} value={name} />
      <Deck center={true} subtle={true} value={deck} />
    </Wrapper>
  );
}

export function SolidBackdrop({
  breadcrumb,
  deck,
  narrowTitle = false,
  title,
  titleClasses,
}: {
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  narrowTitle?: boolean;
  title: string;
  titleClasses?: string;
}) {
  return (
    <Wrapper narrowChildren={narrowTitle} size="small">
      <Breadcrumb value={breadcrumb} />
      <Title className={titleClasses} value={title} />
      <Deck value={deck} />
    </Wrapper>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return false;
  }

  return (
    <p className="mb-6 font-sans text-sm tracking-wide text-subtle uppercase">
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
  size?: "default" | "large" | "small" | "xsmall";
  textInverse?: boolean;
}) {
  const defaultSizes =
    "min-h-[240px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,70vh,1350px)]";

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
          : defaultSizes;

  return (
    <header
      className={`
        ${sizes}
        ${textInverse ? "text-inverse" : ""}
        ${heroImage ? "bg-[#000]" : "bg-canvas"}
        relative flex w-full flex-col content-start items-center justify-end
        gap-6 pt-40
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
          tablet:pt-20 tablet:pb-10
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
  breadcrumb,
  centerText = false,
  deck,
  imageProps,
  size = "default",
  title,
  titleClasses,
}: {
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
      className="absolute inset-0 size-full object-cover object-top"
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
