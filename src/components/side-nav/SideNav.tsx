/**
 * Navigation component for jumping to specific sections within a page.
 * @param props - Component props
 * @param props.children - SubNavLink components to display
 * @returns Sticky navigation bar with jump links
 */
export function SideNav({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <nav
      className={`
        sticky top-[148px] z-nav-menu scrollbar-hidden h-[calc(100vh-148px)]
        overflow-y-auto bg-sidenav
        tablet:top-24 tablet:h-[calc(100vh-96px)] tablet:px-4
      `}
    >
      <div className={`flex flex-col text-md font-semibold tracking-wide`}>
        <h3
          className={`
            sr-only shrink-0 snap-start p-4 font-sans text-xs font-normal
            tracking-wide whitespace-nowrap text-subtle uppercase
          `}
        >
          Jump to:
        </h3>
        <ul className={`contents`}>{children}</ul>
      </div>
    </nav>
  );
}

/**
 * Link component for navigation items in the SideNav.
 * Displays as an active link if linkFunc is provided, otherwise as inactive text.
 * @param props - Component props
 * @param props.linkFunc - Optional function to generate href from value
 * @param props.value - Display text and link parameter
 * @returns Navigation link or text element
 */
export function SideNavLink({
  linkFunc,
  value,
}: {
  linkFunc?: (value: string) => string;
  value: string;
}): React.JSX.Element {
  return (
    <li
      className={`
        snap-start text-center font-light
        first-of-type:pt-6
        last-of-type:pb-6
        ${linkFunc ? "text-default" : `text-grey`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            group/item block transform-gpu px-4 py-3 transition-all
            hover:scale-110 hover:text-emphasis
          `}
          href={linkFunc(value)}
        >
          {value}
        </a>
      ) : (
        <div className={`px-4 py-3`}>{value}</div>
      )}
    </li>
  );
}
