import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

/**
 * Renders long-form text content with responsive typography styling.
 * Wrapper around RenderedMarkdown that applies consistent typography
 * optimized for longer text content with responsive sizing.
 *
 * @param props - The component props
 * @param props.className - Optional additional CSS classes to apply
 * @param props.text - The text content to render (supports markdown)
 * @returns A JSX element containing the styled long-form text
 */
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
        text-md/7 tracking-prose
        tablet:text-xl/8
        ${className ?? ""}
      `}
      text={text}
    />
  );
}
