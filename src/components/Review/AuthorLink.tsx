type Props = {
  as?: React.ElementType;
  className?: string;
  name: string;
  notes?: string;
  slug?: string;
};

export function AuthorLink({
  as = "div",
  className,
  name,
  notes,
  slug,
}: Props): React.JSX.Element {
  const Component = as;

  if (slug) {
    return (
      <Component className={className}>
        <a href={`/authors/${slug}/`}>{name}</a>
        <AuthorNotes notes={notes} />
      </Component>
    );
  }

  return (
    <Component className={className}>
      {name}
      <AuthorNotes notes={notes} />
    </Component>
  );
}

function AuthorNotes({ notes }: { notes?: string }): false | React.JSX.Element {
  if (!notes) {
    return false;
  }

  return <span className="text-subtle"> ({notes})</span>;
}
