import { ccn } from "~/utils/concatClassNames";

import { Footer } from "./Footer";
import { Mast } from "./Mast";

export function Layout({
  addGradient,
  children,
  className,
  hasBackdrop = true,
  hideLogo = false,
  ...rest
}: {
  [x: string]: unknown;
  addGradient?: boolean;
  children: React.ReactNode;
  className?: string;
  hasBackdrop?: boolean;
  hideLogo?: boolean;
}): JSX.Element {
  if (addGradient === undefined) {
    addGradient = hasBackdrop;
  }

  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-skip-link mx-auto
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
        />
        <main className={ccn("grow", className)} id="content" {...rest}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
