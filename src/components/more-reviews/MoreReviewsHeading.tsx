import { SubHeading } from "~/components/sub-heading/SubHeading";

/**
 * Renders a styled heading for "More Reviews" sections.
 * Creates a heading with accent text and hover effects, linking to
 * a page with more content. Polymorphic component supporting different heading levels.
 *
 * @param props - The component props
 * @param props.accentText - Text to display with accent styling (typically a count)
 * @param props.as - The HTML heading element to render (defaults to "h2")
 * @param props.href - URL to link to when the heading is clicked
 * @param props.text - Main heading text
 * @returns A JSX element containing the styled heading link
 */
export function MoreReviewsHeading({
  accentText,
  as = "h2",
  href,
  text,
}: {
  accentText: string;
  as?: "h2" | "h3" | "h4" | "h5";
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <SubHeading as={as}>
      <a
        className={`
          relative -mb-1 inline-block transform-gpu pb-1 transition-all
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-right after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text} <span className={`text-accent`}>{accentText}</span>
      </a>
    </SubHeading>
  );
}
