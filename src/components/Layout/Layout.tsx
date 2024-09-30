import { ccn } from "src/utils/concatClassNames";

import { Footer } from "./Footer";
import { Mast } from "./Mast";

export function Layout({
  hideLogo = false,
  hasBackdrop = true,
  addGradient,
  children,
  className,
  ...rest
}: {
  hideLogo?: boolean;
  addGradient?: boolean;
  hasBackdrop?: boolean;
  children: React.ReactNode;
  className?: string;
  [x: string]: unknown;
}): JSX.Element {
  if (typeof addGradient == "undefined") {
    addGradient = hasBackdrop;
  }

  return (
    <div>
      <a
        href="#content"
        className="absolute left-1/2 top-0.5 z-50 mx-auto bg-subtle px-6 py-2 text-center text-accent [transform:translate(-50%,calc(-100%_-_2px))] focus:[transform:translate(-50%,0%)]"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast
          hideLogo={hideLogo}
          hasBackdrop={hasBackdrop}
          addGradient={addGradient}
        />
        <main className={ccn("grow", className)} id="content" {...rest}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
