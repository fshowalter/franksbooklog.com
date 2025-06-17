import type { JSX } from "react";
export function StatsCallout({
  label,
  value,
}: {
  label: string;
  value: number;
}): JSX.Element {
  return (
    <div
      className={`
        flex size-36 flex-col justify-center rounded-full bg-stripe text-center
        text-default shadow-all
      `}
    >
      <div className="text-[2rem] leading-8">{value.toLocaleString()}</div>{" "}
      <div className="font-sans text-sm leading-6 font-light text-subtle">
        {label}
      </div>
    </div>
  );
}
