/**
 * Renders a styled header link for filter and sort sections.
 * Used in page headers to provide navigation back to main listing pages.
 * Features hover effects and accent styling to match the design system.
 * 
 * @param props - The component props
 * @param props.href - The URL to navigate to when clicked
 * @param props.text - The link text to display
 * @returns A JSX element containing the styled header link
 */
export function FilterAndSortHeaderLink({
  href,
  text,
}: {
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex items-start gap-x-4 bg-default px-4 font-sans text-[13px] font-bold
        text-nowrap text-accent uppercase
      `}
    >
      <a
        className={`
          relative inline-block transform-gpu py-1 transition-transform
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-center after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text}
      </a>
    </div>
  );
}
