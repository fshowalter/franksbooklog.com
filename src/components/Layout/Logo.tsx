export function Logo() {
  return (
    <div className="flex flex-col">
      <div
        className="whitespace-nowrap font-normal leading-8"
        style={{ fontSize: "1.5625rem" }}
      >
        <a href="/">Frank&apos;s Book Log</a>
      </div>
      <p className={"w-full pl-px text-sm italic leading-4 opacity-85"}>
        Literature is a relative term.
      </p>
    </div>
  );
}
