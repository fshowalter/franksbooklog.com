import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "./Avatar";

export function SolidBackdrop({
  breadcrumb,
  deck,
  title,
  titleStyle,
}: {
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  title: string;
  titleStyle?: string;
}) {
  return (
    <Wrapper size="small">
      <Breadcrumb value={breadcrumb} />
      <Title className={titleStyle} value={title} />
      <Deck value={deck} />
    </Wrapper>
  );
}

export function AvatarBackdrop({
  avatarImageProps,
  breadcrumb,
  deck,
  name,
}: {
  avatarImageProps: AvatarImageProps | null;
  breadcrumb?: React.ReactNode;
  deck: React.ReactNode;
  name: string;
}) {
  return (
    <Wrapper centerText={true} size="small">
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
      <Breadcrumb value={breadcrumb} />
      <Title center={true} value={name} />
      <Deck center={true} subtle={true} value={deck} />
    </Wrapper>
  );
}

function Wrapper({
  centerText = false,
  children,
  heroImage,
  size = "default",
}: {
  centerText?: boolean;
  children: React.ReactNode;
  heroImage?: React.ReactNode;
  size?: "default" | "large" | "small";
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
      className={`${sizes} relative flex w-full flex-col content-start items-center justify-end gap-6 bg-canvas pb-8 pt-40 tablet:pb-10 tablet:pt-40 desktop:pb-16 desktop:pt-40`}
    >
      {heroImage}
      <div
        className={`${centerText ? "items-center" : ""} z-10 mx-auto flex w-full max-w-screen-max flex-col px-container`}
      >
        {children}
      </div>
    </header>
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
        className
          ? className
          : `font-sans ${center ? "text-center" : ""} text-3xl font-bold uppercase tracking-widest tablet:text-4xl tablet-landscape:text-5xl desktop:text-7xl`
      }
    >
      {value}
    </h1>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return null;
  }

  return (
    <p className="mb-2 font-sans text-sm uppercase tracking-wide text-subtle">
      {value}
    </p>
  );
}

function Deck({
  center,
  subtle,
  value,
}: {
  center?: boolean;
  subtle?: boolean;
  value?: React.ReactNode;
}) {
  if (!value) {
    return null;
  }

  return (
    <p
      className={`mt-1 text-base desktop:my-4 desktop:text-xl ${center ? "text-center" : ""} ${subtle ? "text-subtle" : ""}`}
    >
      {value}
    </p>
  );
}
