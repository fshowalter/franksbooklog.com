import type { ElementType } from "react";

export function LabelText({
  as = "span",
  htmlFor,
  value,
}: {
  as?: ElementType;
  htmlFor?: string;
  value: string;
}) {
  const Component = as;

  return (
    <Component
      className={`
        inline-block h-6 text-left font-sans text-xxs leading-none tracking-wide
        text-subtle uppercase
      `}
      htmlFor={htmlFor}
    >
      {value}
    </Component>
  );
}
