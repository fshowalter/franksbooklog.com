import type React from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { Avatar } from "~/components/avatar/Avatar";

/**
 * Configuration for avatar images used in hero sections
 */
export const AvatarImageConfig = {
  height: 250,
  width: 250,
};

/**
 * Backdrop component specifically designed for author pages with avatar display.
 * Combines a full-screen backdrop image with a centered avatar, name, and description.
 *
 * @param props - Component props
 * @param props.avatarImageProps - Avatar image properties, if available
 * @param props.backdropImageProps - Background image properties
 * @param props.breadcrumb - Optional breadcrumb navigation element
 * @param props.deck - Description or subtitle content
 * @param props.name - Author name to display as the main title
 * @returns Avatar backdrop component with hero styling
 */
export function AvatarBackdrop({
  avatarImageProps,
  backdropImageProps,
  breadcrumb,
  deck,
  title,
}: {
  avatarImageProps?: AvatarImageProps;
  backdropImageProps: BackdropImageProps;
  breadcrumb?: {
    href: string;
    text: string;
  };
  deck: React.ReactNode;
  title: string;
}): React.JSX.Element {
  const heroImage = (
    <img
      className={`
        absolute inset-0 size-full object-cover object-top text-inverse
      `}
      {...backdropImageProps}
      {...BackdropImageConfig}
      alt=""
      fetchPriority="high"
      loading="eager"
    />
  );

  return (
    <Wrapper centerText={true} heroImage={heroImage} size="default">
      <Breadcrumb value={breadcrumb} />
      {avatarImageProps && (
        <div
          className={`
            mx-auto mb-6 w-4/5 max-w-[250px] transform-gpu overflow-hidden
            tablet:mb-8
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
      <Title center={true} value={title} />
      <Deck center={true} shadow={true} value={deck} />
    </Wrapper>
  );
}

/**
 * Configuration for backdrop images used in hero sections
 */
export const BackdropImageConfig = {
  height: 1350,
  sizes: "100vw",
  width: 2400,
};

/**
 * General-purpose backdrop component for hero sections with customizable content.
 * Provides a full-screen background image with overlay text and optional elements.
 *
 * @param props - Component props
 * @param props.bottomShadow - Whether to add a bottom shadow gradient (defaults to true)
 * @param props.breadcrumb - Optional breadcrumb navigation elements
 * @param props.centerText - Whether to center-align the text content (defaults to false)
 * @param props.deck - Optional subtitle or description content
 * @param props.imageProps - Background image properties
 * @param props.size - Size variant of the backdrop (defaults to "default")
 * @param props.title - Main title text to display
 * @param props.titleClasses - Custom CSS classes for the title
 * @returns Backdrop component with hero styling
 */
export function Backdrop({
  backdropImageProps,
  bottomShadow = true,
  breadcrumb,
  centerText = false,
  deck,
  size = "default",
  title,
  titleClasses,
}: {
  backdropImageProps: BackdropImageProps;
  bottomShadow?: boolean;
  breadcrumb?: {
    href: string;
    text: string;
  };
  centerText?: boolean;
  deck: React.ReactNode;
  size?: "default" | "large";
  title: string;
  titleClasses?: string;
}): React.JSX.Element {
  const heroImage = (
    <img
      className={`absolute inset-0 size-full object-cover object-top`}
      {...backdropImageProps}
      {...BackdropImageConfig}
      alt=""
      fetchPriority="high"
      loading="eager"
    />
  );

  return (
    <Wrapper
      bottomShadow={bottomShadow}
      centerText={centerText}
      heroImage={heroImage}
      size={size}
    >
      <Breadcrumb value={breadcrumb} />
      <Title className={titleClasses} value={title} />
      <Deck center={centerText} shadow={true} value={deck} />
    </Wrapper>
  );
}

function Breadcrumb({
  value,
}: {
  value?: { href: string; text: string };
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }

  return (
    <p className="mb-4">
      <a
        className={`
          relative inline-block font-sans text-sm font-bold tracking-wide
          text-white/85 uppercase
          after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full
          after:origin-center after:scale-x-0 after:bg-white/75
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={value.href}
      >
        {value.text}
      </a>
    </p>
  );
}

function Deck({
  center,
  shadow,
  value,
}: {
  center?: boolean;
  shadow: boolean;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <p
      className={`
        mt-1 font-sans text-base
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
}): React.JSX.Element {
  return (
    <h1
      className={
        className ||
        `
          ${center ? "text-center" : ""}
          text-[2rem] leading-10 font-extrabold
          [text-shadow:1px_1px_2px_rgba(0,0,0,.25)]
          tablet:text-4xl
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
  bottomShadow = true,
  centerText = false,
  children,
  heroImage,
  size = "default",
}: {
  bottomShadow?: boolean;
  centerText?: boolean;
  children: React.ReactNode;
  heroImage?: React.ReactNode;
  size?: "default" | "large" | "small";
}): React.JSX.Element {
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
        relative flex w-full flex-col content-start items-center justify-end
        gap-6 bg-[#2A2B2A] pt-40 pb-8 text-inverse
        tablet:pt-40 tablet:pb-10
        laptop:pt-40 laptop:pb-16
      `}
    >
      {heroImage}
      <div
        className={`
          ${centerText ? "items-center" : ""}
          z-10 mx-auto flex w-full max-w-(--breakpoint-desktop) flex-col
          px-container
          ${
            bottomShadow
              ? `
                after:absolute after:top-0 after:left-0 after:-z-10 after:h-full
                after:w-full after:bg-(image:--hero-gradient)
              `
              : ""
          }
        `}
      >
        {children}
      </div>
    </header>
  );
}
