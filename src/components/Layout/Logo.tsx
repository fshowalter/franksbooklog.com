import { ccn } from "~/utils/concatClassNames";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={ccn("flex flex-col", className)}>
      <div className="whitespace-nowrap text-[1.375rem] font-normal leading-8 tablet:text-[1.5625rem]">
        <a href="/">Frank&apos;s Book Log</a>
      </div>
      <p className={"w-full pl-px text-sm italic leading-4 opacity-85"}>
        by Frank Showalter
      </p>
    </div>
  );
}
