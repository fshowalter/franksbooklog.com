export function StatsCallout({
  value,
  label,
}: {
  value: number;
  label: string;
}): JSX.Element {
  return (
    <div className="flex size-36 flex-col justify-center rounded-full bg-stripe text-center text-default shadow-all">
      <div className="text-[2rem] leading-8">{value.toLocaleString()}</div>{" "}
      <div className="font-sans text-sm font-light leading-6 text-subtle">
        {label}
      </div>
    </div>
  );
}
