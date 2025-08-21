export function ListItemTitle({
  slug,
  title,
}: {
  slug?: string;
  title: string;
}) {
  if (slug) {
    return (
      <a
        className={`
          text-base leading-5 font-semibold text-accent
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:opacity-0
        `}
        href={`/reviews/${slug}/`}
      >
        {title}
      </a>
    );
  }

  return (
    <span className="block text-base leading-5 font-semibold text-muted">
      {title}
    </span>
  );
}
