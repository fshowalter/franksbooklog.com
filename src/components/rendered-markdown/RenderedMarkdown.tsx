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
