/**
 * Renders a styled sub-heading with consistent typography.
 * Polymorphic component that can render as different heading levels (h2-h5)
 * while maintaining consistent styling for secondary headings throughout the site.
 *
 * @param props - The component props
 * @param props.as - The HTML heading element to render (h2, h3, h4, or h5)
 * @param props.children - The content to display within the heading
 * @param props.className - Optional additional CSS classes to apply
 * @returns A JSX element containing the styled sub-heading
 */
export function SubHeading({
  as,
  children,
  className,
}: {
  as: "h2" | "h3" | "h4" | "h5";
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        py-10 font-sans text-xs font-bold tracking-wide text-subtle uppercase
        ${className ?? ""}
      `}
    >
      {children}
    </Component>
  );
}
