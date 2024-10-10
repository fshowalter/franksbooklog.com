import type { ElementType } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  name: string;
  notes?: null | string;
  slug: null | string;
};

export function AuthorLink({
  as = "div",
  className,
  name,
  notes,
  slug,
}: Props): JSX.Element {
  const Component = as;

  let authorNotes = null;

  if (notes) {
    authorNotes = <> ({notes})</>;
  }

  if (slug) {
    return (
      <Component className={className}>
        <a href={`/reviews/authors/${slug}/`}>{name}</a>
        {authorNotes}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {name}
      {authorNotes}
    </Component>
  );
}
