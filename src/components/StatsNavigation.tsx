import { ccn } from "~/utils/concatClassNames";

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
  currentYear,
  linkFunc,
  year,
}: {
  currentYear: string;
  linkFunc: (y: string) => string;
  year: string;
}) {
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
  className,
  currentYear,
  linkFunc,
  years,
}: {
  className?: string;
  currentYear: string;
  linkFunc: (year: string) => string;
  years: readonly string[];
}): JSX.Element {
  return (
    <nav className={ccn("bg-accent", className)}>
      <ul className="mx-auto flex max-w-screen-max overflow-x-auto px-container font-sans text-sm font-normal tracking-wide desktop:justify-center">
        <AllTimeLink currentYear={currentYear} linkFunc={linkFunc} />
        {[...years].reverse().map((year) => {
          return (
            <YearLink
              currentYear={currentYear}
              key={year}
              linkFunc={linkFunc}
              year={year}
            />
          );
        })}
      </ul>
    </nav>
  );
}
