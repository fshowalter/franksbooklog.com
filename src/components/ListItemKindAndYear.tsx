export function ListItemKindAndYear({
  kind,
  year,
}: {
  kind: string;
  year: string;
}) {
  return (
    <div className="font-sans text-xs font-light leading-4 text-subtle">
      <span>{kind} | </span>
      {year}
    </div>
  );
}
