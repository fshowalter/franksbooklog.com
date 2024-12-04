import type { ElementType, JSX } from "react";

import { ccn } from "~/utils/concatClassNames";

export function RenderedMarkdown({
  as = "div",
  className,
  text,
}: {
  as?: ElementType;
  className?: string;
  text: string | undefined;
}): false | JSX.Element {
  if (!text) {
    return false;
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
