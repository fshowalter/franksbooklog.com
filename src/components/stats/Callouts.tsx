type Props = {
  stats: {
    label: string;
    value: number;
  }[];
};

export function Callouts({ stats }: Props): React.JSX.Element {
  return (
    <div
      className={`
        flex flex-wrap justify-center gap-6
        desktop:flex-nowrap
      `}
    >
      {stats.map((stat) => (
        <StatsCallout key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}

function StatsCallout({
  label,
  value,
}: {
  label: string;
  value: number;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex size-36 flex-col justify-center rounded-full bg-default text-center
        text-default shadow-all
      `}
    >
      <div className="text-[2rem]/8">{value.toLocaleString()}</div>{" "}
      <div className="font-sans text-sm/6 text-subtle">{label}</div>
    </div>
  );
}
