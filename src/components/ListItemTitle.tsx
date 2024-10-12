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
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-cover before:w-list-item-cover before:bg-[#fff] before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 desktop:before:left-6"
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
