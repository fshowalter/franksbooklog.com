import { ccn } from "~/utils/concatClassNames";

import { RenderedMarkdown } from "./RenderedMarkdown";

export function LongFormText({
  className,
  text,
}: {
  className?: string;
  text: string | undefined;
}) {
  return (
    <RenderedMarkdown
      className={ccn(
        `
          text-md/7 tracking-[0.3px]
          tablet:text-xl/8
        `,
        className,
      )}
      text={text}
    />
  );
}
