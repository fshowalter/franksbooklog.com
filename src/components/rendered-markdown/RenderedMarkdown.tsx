/**
 * Renders pre-processed markdown content as HTML.
 * Polymorphic component that can render as different HTML elements while
 * safely injecting processed markdown content. Returns false if no text provided.
 *
 * @param props - The component props
 * @param props.as - The HTML element type to render (defaults to "div")
 * @param props.className - Optional additional CSS classes to apply
 * @param props.text - The processed markdown HTML string to render
 * @returns A JSX element containing the rendered markdown, or false if no text
 */
export function RenderedMarkdown({
  as = "div",
  className,
  text,
}: {
  as?: React.ElementType;
  className?: string;
  text: string | undefined;
}): false | React.JSX.Element {
  if (!text) {
    return false;
  }

  const Component = as;

  return (
    <Component
      className={`
        rendered-markdown
        ${className ?? ""}
      `}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}
