import type { ElementType } from "react";

type Props = {
  as?: ElementType;
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
}: Props): JSX.Element {
  const Component = as;

  if (slug) {
    return (
      <Component className={className}>
        <a href={`/reviews/authors/${slug}/`}>{name}</a>
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

function AuthorNotes({ notes }: { notes?: string }) {
  if (!notes) {
    return false;
  }

  return <span className="text-subtle"> ({notes})</span>;
}
