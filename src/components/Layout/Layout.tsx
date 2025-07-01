import type { JSX } from "react";

import { Footer } from "./Footer";
import { Mast } from "./Mast";

export function Layout({
  addGradient,
  children,
  className,
  hasBackdrop = false,
  hideLogo = false,
  staticMast = false,
  ...rest
}: {
  [x: string]: unknown;
  addGradient?: boolean;
  children: React.ReactNode;
  className?: string;
  hasBackdrop?: boolean;
  hideLogo?: boolean;
  staticMast?: boolean;
}): JSX.Element {
  if (addGradient === undefined) {
    addGradient = hasBackdrop;
  }

  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-50 mx-auto
          [transform:translate(-50%,calc(-100%-2px))]
          bg-subtle px-6 py-2 text-center text-accent
          focus:[transform:translate(-50%,0%)]
        `}
        href="#content"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast
          addGradient={addGradient}
          hasBackdrop={hasBackdrop}
          hideLogo={hideLogo}
          staticMast={staticMast}
        />
        <main
          className={`
            grow transition-[opacity] duration-200 ease-in-out
            group-has-[#nav:checked]:opacity-80
            ${className}
          `}
          id="content"
          {...rest}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
