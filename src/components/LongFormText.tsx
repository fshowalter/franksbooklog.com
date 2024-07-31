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
      className={ccn("text-md/7 tracking-0.3px tablet:text-xl/8", className)}
    />
  );
}
