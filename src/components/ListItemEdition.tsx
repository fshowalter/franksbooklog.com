import type { JSX } from "react";

export function ListItemEdition({ value }: { value: string }): JSX.Element {
  return (
    <div className={`font-sans text-xs leading-4 tracking-prose text-subtle`}>
      {value}
    </div>
  );
}
