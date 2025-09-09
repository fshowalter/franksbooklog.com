import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

export function LongFormText({
  className,
  text,
}: {
  className?: string;
  text: string | undefined;
}): React.JSX.Element {
  return (
    <RenderedMarkdown
      className={`
        text-md/7 tracking-[0.3px]
        tablet:text-xl/8
        ${className ?? ""}
      `}
      text={text}
    />
  );
}
