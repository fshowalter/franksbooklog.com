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
          block font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-accent after:opacity-0
          hover:before:opacity-0
          tablet:before:left-4
          desktop:before:left-6
        `}
        href={`/reviews/${slug}/`}
      >
        {title}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}
    </span>
  );
}
