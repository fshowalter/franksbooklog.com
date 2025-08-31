export function ListItemTitle({
  slug,
  title,
}: {
  slug?: string;
  title: string;
}): React.JSX.Element {
  if (slug) {
    return (
      <a
        className={`
          text-base leading-5 font-semibold text-default transition-all
          duration-500
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:opacity-0
          hover:text-accent
        `}
        href={`/reviews/${slug}/`}
      >
        {title}
      </a>
    );
  }

  return (
    <span className={`block text-base leading-5 font-semibold text-subtle`}>
      {title}
    </span>
  );
}
