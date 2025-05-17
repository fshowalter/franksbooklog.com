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
      <div className="safari-border-radius-fix mx-auto mb-6 w-4/5 max-w-[250px] overflow-hidden rounded-full">
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
  titleStyle,
}: {
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  narrowTitle?: boolean;
  title: string;
  titleStyle?: string;
}) {
  return (
    <Wrapper narrowChildren={narrowTitle} size="small">
      <Breadcrumb value={breadcrumb} />
      <Title className={titleStyle} value={title} />
      <Deck value={deck} />
    </Wrapper>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return false;
  }

  return (
    <p className="mb-6 font-sans text-sm uppercase tracking-wide text-subtle">
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
      className={`mt-1 text-base desktop:my-4 desktop:text-xl ${center ? "text-center" : ""} ${shadow ? "[text-shadow:1px_1px_2px_black]" : ""} ${subtle ? "text-subtle" : ""}`}
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
        `font-sans ${center ? "text-center" : ""} text-3xl font-bold uppercase tracking-widest tablet:text-4xl tablet-landscape:text-5xl desktop:text-7xl`
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
  size?: "default" | "large" | "small";
  textInverse?: boolean;
}) {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,70vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[clamp(340px,50vh,1350px)]";

  const sizes =
    size === "large"
      ? largeSizes
      : size === "small"
        ? smallSizes
        : defaultSizes;

  return (
    <header
      className={`${sizes} ${textInverse ? "text-inverse" : ""} relative flex w-full flex-col content-start items-center justify-end gap-6 bg-canvas pb-8 pt-40 tablet:pb-10 tablet:pt-40 desktop:pb-16 desktop:pt-40`}
    >
      {heroImage}
      <div className="absolute inset-0 bg-canvas opacity-45"></div>
      <div
        className={`${centerText ? "items-center" : ""} z-10 mx-auto flex w-full ${narrowChildren ? "px-container text-center tablet:max-w-unset tablet:px-0" : "max-w-screen-max px-container"} flex-col`}
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
  deck,
  imageProps,
  size = "default",
  title,
  titleStyle,
}: {
  breadcrumb?: React.ReactNode;
  deck?: React.ReactNode;
  imageProps: BackdropImageProps;
  size?: "default" | "large";
  title: string;
  titleStyle?: string;
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
    <Wrapper heroImage={heroImage} size={size} textInverse={true}>
      <Breadcrumb value={breadcrumb} />
      <Title className={titleStyle} value={title} />
      <Deck shadow={true} value={deck} />
    </Wrapper>
  );
}
