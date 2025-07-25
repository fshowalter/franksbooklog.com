import { BarGradient } from "./BarGradient";

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
}) {
  const maxBar = values.reduce((total, val) => total + val.count, 0);

  return (
    <section className="w-full bg-default px-container pb-8">
      <h2
        className={`
          py-4 font-medium
          laptop:text-xl
        `}
      >
        {title}
      </h2>
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
                    font-sans text-xs text-muted
                    tablet:text-sm
                  `}
                >
                  {value.name}
                </div>
                <div
                  className={`
                    col-start-3 self-center pb-1 text-right font-sans text-xs
                    text-nowrap text-subtle
                    tablet:text-sm
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
