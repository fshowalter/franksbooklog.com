import type React from "react";

export function Abandoned({
  className,
  value,
}: {
  className?: string;
  value: string | undefined;
}): false | React.JSX.Element {
  if (value !== "Abandoned") {
    return false;
  }

  return (
    <div
      className={`
        rounded-sm bg-abandoned px-2 py-1 font-sans text-xxs font-bold
        tracking-prose text-inverse uppercase
        ${className}
      `}
    >
      Abandoned
    </div>
  );
}
