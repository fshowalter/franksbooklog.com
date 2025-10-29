import type { NavItem } from "./navItems";

import { navItems } from "./navItems";

/**
 * Renders a table of contents navigation menu.
 * Displays the main navigation items as an ordered list with sub-menus
 * when items have child navigation items. Used in footer and mobile menu.
 *
 * @returns A JSX element containing the table of contents navigation
 */
export function TableOfContents(): React.JSX.Element {
  return (
    <ol className={`flex flex-col gap-y-6`}>
      {navItems.map((item) => {
        return <MenuItem key={item.target} value={item} />;
      })}
    </ol>
  );
}

/**
 * Internal component for rendering individual menu items.
 * Handles main navigation items and their associated sub-menus.
 * Includes hover effects and responsive styling.
 *
 * @param props - The component props
 * @param props.value - The navigation item data to render
 * @returns A JSX element containing the menu item and any sub-menu
 */
function MenuItem({ value }: { value: NavItem }): React.JSX.Element {
  return (
    <li
      className={`
        block w-1/2 text-2xl whitespace-nowrap
        laptop:w-full
      `}
    >
      <a
        className={`
          relative inline-block origin-left transform-gpu transition-all
          duration-500
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-center after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:text-accent hover:after:scale-x-100
        `}
        href={value.target}
      >
        {value.text}
      </a>
      <SubMenu values={value.subItems} />
    </li>
  );
}

/**
 * Internal component for rendering sub-navigation menus.
 * Only renders if there are sub-items to display. Uses smaller styling
 * appropriate for secondary navigation items.
 *
 * @param props - The component props
 * @param props.values - Array of sub-navigation items to render
 * @returns A JSX element containing the sub-menu, or false if no items
 */
function SubMenu({ values }: { values: NavItem[] }): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            className={`
              mb-3 ml-1 font-sans text-[13px] font-medium tracking-wider
              text-subtle uppercase
              last:-mb-1
            `}
            key={value.target}
          >
            <a
              className={`
                relative inline-block origin-left transform-gpu pb-1
                transition-all duration-500
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-center after:scale-x-0 after:bg-accent
                after:transition-transform after:duration-500
                hover:text-accent hover:after:scale-x-100
              `}
              href={value.target}
            >
              {value.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
