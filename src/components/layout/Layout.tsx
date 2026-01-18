import type React from "react";

import { AvatarBackdrop, Backdrop } from "./Backdrop";
import { Footer } from "./Footer";
import { Mast } from "./Mast";

/**
 * Main layout component providing the overall page structure.
 * Includes skip-to-content link for accessibility, masthead with navigation,
 * main content area, and footer. Handles backdrop and gradient styling.
 *
 * @param props - Component props
 * @param props.addGradient - Whether to add gradient overlay (defaults to hasBackdrop value)
 * @param props.children - Page content to render in main area
 * @param props.className - Additional CSS classes for main content
 * @param props.hasBackdrop - Whether to show backdrop image (defaults to true)
 * @param props.hideLogo - Whether to hide the site logo (defaults to false)
 * @param props.rest - Additional props passed to main element
 * @returns Complete page layout structure
 */
export function Layout({
  addGradient,
  backdrop,
  children,
  className,
  hideLogo = false,
  ...rest
}: {
  [x: string]: unknown;
  addGradient?: boolean;
  backdrop?: Pick<
    React.ComponentProps<typeof AvatarBackdrop>,
    "avatarImageProps"
  > &
    React.ComponentProps<typeof Backdrop>;
  children: React.ReactNode;
  className?: string;
  hasBackdrop?: boolean;
  hideLogo?: boolean;
}): React.JSX.Element {
  if (addGradient === undefined) {
    addGradient = backdrop ? true : false;
  }

  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-skip-link mx-auto
          transform-[translate(-50%,calc(-100%-2px))] bg-subtle px-6 py-2
          text-center text-accent
          focus:transform-[translate(-50%,0%)]
        `}
        href="#content"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast
          addGradient={addGradient}
          hasBackdrop={backdrop ? true : false}
          hideLogo={hideLogo}
        />
        <main
          className={`
            grow
            ${className ?? ""}
          `}
          id="content"
          {...rest}
        >
          {backdrop &&
            (backdrop.avatarImageProps ? (
              <AvatarBackdrop {...backdrop} />
            ) : (
              <Backdrop {...backdrop} />
            ))}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
