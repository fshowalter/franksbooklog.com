import type { AvatarImageProps } from "src/api/avatars";

import { Avatar } from "./Avatar";

export function SolidBackdrop({
  title,
  deck,
  breadcrumb,
  titleStyle,
}: {
  title: string;
  deck: React.ReactNode;
  titleStyle?: string;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <Wrapper size="small">
      <Breadcrumb value={breadcrumb} />
      <Title value={title} className={titleStyle} />
      <Deck value={deck} />
    </Wrapper>
  );
}

export function AvatarBackdrop({
  avatarImageProps,
  name,
  deck,
  breadcrumb,
}: {
  avatarImageProps: AvatarImageProps | null;
  name: string;
  deck: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <Wrapper centerText={true} size="small">
      <div className="safari-border-radius-fix mx-auto mb-6 w-4/5 max-w-[250px] overflow-hidden rounded-full">
        <Avatar
          imageProps={avatarImageProps}
          width={250}
          height={250}
          loading="lazy"
          decoding="async"
          data-pagefind-meta="image[src]"
        />
      </div>
      <Breadcrumb value={breadcrumb} />
      <Title value={name} center={true} />
      <Deck value={deck} center={true} subtle={true} />
    </Wrapper>
  );
}

export function StatsBackdrop({
  title,
  deck,
  breadcrumb,
  children,
}: {
  title: string;
  deck: React.ReactNode;
  breadcrumb: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Wrapper centerText={true} size="small">
      <Breadcrumb value={breadcrumb} />
      <Title
        className="mb-4 text-4xl desktop:text-7xl"
        center={true}
        value={title}
      />
      <p className="mb-6 text-center font-sans text-xs uppercase tracking-wide text-subtle">
        {deck}
      </p>
      {children}
    </Wrapper>
  );
}

function Wrapper({
  children,
  centerText = false,
  size = "default",
  heroImage,
}: {
  children: React.ReactNode;
  centerText?: boolean;
  size?: "default" | "large" | "small";
  heroImage?: React.ReactNode;
}) {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,60vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[240px] desktop:min-h-[clamp(640px,50vh,1350px)]";

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
  value,
  className,
  center,
}: {
  value: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <h1
      className={
        className
          ? className
          : `font-sans ${center ? "text-center" : ""} text-2xl font-bold uppercase tracking-widest tablet:text-4xl tablet-landscape:text-5xl desktop:text-7xl`
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
  value,
  center,
  subtle,
}: {
  value?: React.ReactNode;
  center?: boolean;
  subtle?: boolean;
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
