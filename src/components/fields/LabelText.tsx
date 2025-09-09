/**
 * Renders a styled label text component for form fields.
 * Polymorphic component that can render as different HTML elements
 * while maintaining consistent label styling. Typically used with form inputs.
 *
 * @param props - The component props
 * @param props.as - The HTML element type to render (defaults to "span")
 * @param props.htmlFor - Optional ID of the form element this label is for
 * @param props.value - The label text to display
 * @returns A JSX element containing the styled label text
 */
export function LabelText({
  as = "span",
  htmlFor,
  value,
}: {
  as?: React.ElementType;
  htmlFor?: string;
  value: string;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        inline-block h-6 text-left font-sans text-xs leading-none font-semibold
        tracking-wide text-subtle uppercase
      `}
      htmlFor={htmlFor}
    >
      {value}
    </Component>
  );
}
