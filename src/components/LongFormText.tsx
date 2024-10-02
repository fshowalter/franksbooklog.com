import { ccn } from "src/utils/concatClassNames";

import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  text,
  className,
}: {
  text: string | null;
  className?: string;
}) {
  if (!text) {
    return null;
  }

  return (
    <RenderedMarkdown
      text={text}
      className={ccn("tracking-0.3px text-md/7 tablet:text-xl/8", className)}
    />
  );
}
