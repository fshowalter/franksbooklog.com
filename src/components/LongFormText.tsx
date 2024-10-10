import { ccn } from "~/utils/concatClassNames";

import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  className,
  text,
}: {
  className?: string;
  text: null | string;
}) {
  if (!text) {
    return null;
  }

  return (
    <RenderedMarkdown
      className={ccn("tracking-0.3px text-md/7 tablet:text-xl/8", className)}
      text={text}
    />
  );
}
