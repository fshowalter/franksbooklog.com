import type { JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

export function PullQuote({
  attribution,
  children,
  className,
}: {
  attribution?: string;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    // eslint-disable-next-line better-tailwindcss/no-unregistered-classes
    <blockquote className={ccn("pull-quote", className)}>
      <span className="relative z-10 italic">{children}</span>
      {attribution && (
        <cite className="mt-4 block text-base font-normal text-muted not-italic">
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
