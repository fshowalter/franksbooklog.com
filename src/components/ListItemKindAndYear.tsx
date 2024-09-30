export function ListItemKindAndYear({
  kind,
  year,
}: {
  kind: string;
  year: string;
}): JSX.Element | null {
  return (
    <div className="font-sans text-xs font-light leading-4 text-subtle">
      <span>{kind} | </span>
      {year}
    </div>
  );
}
