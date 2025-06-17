import { ccn } from "~/utils/concatClassNames";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={ccn("flex flex-col", className)}>
      <div className={`
        text-[1.375rem] leading-8 font-normal whitespace-nowrap
        tablet:text-[1.5625rem]
      `}>
        <a href="/">Frank&apos;s Book Log</a>
      </div>
      <p className={"w-full pl-px text-sm leading-4 italic opacity-85"}>
        by Frank Showalter
      </p>
    </div>
  );
}
