import { BarGradient } from "~/components/bar-gradient/BarGradient";

type Value = {
  count: number;
  name: string;
};

export function Distribution({
  title,
  values,
}: {
  title: string;
  values: readonly Value[];
}): React.JSX.Element {
  const maxBar = values.reduce((total, value) => total + value.count, 0);

  return (
    <section
      className={`
        w-full bg-default px-container pb-8
        laptop:px-12
      `}
    >
      <h2 className="py-4 text-xl font-medium">{title}</h2>
      <div
        className={`
          grid w-full grid-cols-[1fr_24px_auto]
          tablet:whitespace-nowrap
        `}
      >
        {values.map((value) => {
          return (
            <div
              className="col-span-3 grid grid-cols-subgrid py-3"
              key={value.name}
            >
              <div className="col-span-3 grid grid-cols-subgrid">
                <div
                  className={`
                    pb-1 font-sans text-sm leading-3.5 tracking-prose text-muted
                  `}
                >
                  {value.name}
                </div>
                <div
                  className={`
                    col-start-3 self-center pb-1 text-right font-sans text-sm
                    leading-3.5 text-nowrap text-subtle
                  `}
                >
                  {value.count}
                </div>
              </div>
              <div className="col-span-3 row-start-2 bg-subtle">
                <BarGradient maxValue={maxBar} value={value.count} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
