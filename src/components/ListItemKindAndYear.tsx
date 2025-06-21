export function ListItemKindAndYear({
  kind,
  year,
}: {
  kind: string;
  year: string;
}) {
  return (
    <div className="font-sans text-xs leading-4 font-light text-subtle">
      <span>{kind} | </span>
      {year}
    </div>
  );
}
