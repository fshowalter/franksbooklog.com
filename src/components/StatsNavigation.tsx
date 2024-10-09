import { ccn } from "src/utils/concatClassNames";

function AllTimeLink({
  currentYear,
  linkFunc,
}: {
  currentYear: string;
  linkFunc: (year: string) => string;
}): JSX.Element {
  return (
    <li
      className={`text-center ${"all" === currentYear ? "bg-subtle text-default" : "text-inverse"}`}
    >
      {"all" === currentYear ? (
        <div className="whitespace-nowrap p-4 desktop:py-4">All-Time</div>
      ) : (
        <a
          className="block whitespace-nowrap p-4 hover:bg-default hover:text-default desktop:py-4"
          href={linkFunc("all")}
        >
          All-Time
        </a>
      )}
    </li>
  );
}

function YearLink({
  year,
  currentYear,
  linkFunc,
}: {
  year: string;
  currentYear: string;
  linkFunc: (y: string) => string;
}): JSX.Element | null {
  return (
    <li
      className={`text-center ${year === currentYear ? "bg-subtle text-default" : "text-inverse"}`}
    >
      {year === currentYear ? (
        <div className="p-4 desktop:py-4">{year}</div>
      ) : (
        <a
          className="block p-4 hover:bg-subtle hover:text-accent"
          href={linkFunc(year)}
        >
          {year}
        </a>
      )}
    </li>
  );
}

export function StatsNavigation({
  currentYear,
  years,
  linkFunc,
  className,
}: {
  currentYear: string;
  years: readonly string[];
  linkFunc: (year: string) => string;
  className?: string;
}): JSX.Element {
  return (
    <nav className={ccn("bg-accent", className)}>
      <ul className="mx-auto flex max-w-screen-max overflow-x-auto px-container font-sans text-sm font-normal tracking-wide desktop:justify-center">
        <AllTimeLink currentYear={currentYear} linkFunc={linkFunc} />
        {[...years].reverse().map((year) => {
          return (
            <YearLink
              key={year}
              year={year}
              currentYear={currentYear}
              linkFunc={linkFunc}
            />
          );
        })}
      </ul>
    </nav>
  );
}
