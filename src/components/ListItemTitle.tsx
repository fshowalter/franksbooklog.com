import { ccn } from "src/utils/concactClassnames";

interface Props {
  title: string;
  slug?: string | null;
  className?: string;
}

export function ListItemTitle({ title, slug, className }: Props) {
  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className={ccn("block text-md leading-5 text-accent", className)}
      >
        {title}
      </a>
    );
  }

  return (
    <span className={ccn("block text-md leading-5", className)}>{title}</span>
  );
}
