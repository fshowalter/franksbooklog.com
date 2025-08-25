export function ListItemKindAndYear({
  kind,
  year,
}: {
  kind: string;
  year: string;
}) {
  return (
    <div
      className={`font-sans text-[13px] leading-4 tracking-prose text-subtle`}
    >
      <span>{kind} | </span>
      {year}
    </div>
  );
}
