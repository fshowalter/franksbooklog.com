import type { ChangeEvent, JSX } from "react";

import React from "react";

import { ccn } from "~/utils/concatClassNames";

export function SelectInput({
  children,
  className,
  onChange,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: number | string | undefined;
}): JSX.Element {
  return (
    <select
      className={ccn(
        "select-background-image w-full appearance-none border-none bg-default py-2 pl-4 pr-8 text-base leading-6 text-subtle shadow-all outline-accent",
        className,
      )}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
