/**
 * Renders a title for a list item, either as a clickable link or static text.
 * When a slug is provided, the title becomes a clickable link to the review page.
 * When no slug is provided, renders as static text with subtle styling.
 *
 * @param props - The component props
 * @param props.slug - Optional URL slug to make the title a clickable link to the review
 * @param props.title - The title text to display
 * @returns A JSX element containing either a clickable link or static text
 */
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
          text-base/5 font-semibold text-default transition-all duration-500
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
    <span className={`block text-base/5 font-semibold text-subtle`}>
      {title}
    </span>
  );
}
