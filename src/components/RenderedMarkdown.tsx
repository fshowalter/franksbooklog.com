import type { ElementType } from "react";

import { ccn } from "~/utils/concatClassNames";

export function RenderedMarkdown({
  as = "div",
  className,
  text,
}: {
  as?: ElementType;
  className?: string;
  text: null | string;
}): JSX.Element | null {
  if (!text) {
    return null;
  }

  const Component = as;

  return (
    <Component
      className={ccn("rendered-markdown font-light", className)}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}
