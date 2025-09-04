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
