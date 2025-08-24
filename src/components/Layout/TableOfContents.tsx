import type { JSX } from "react";

import type { NavItem } from "./navItems";

import { navItems } from "./navItems";

type Props = React.HTMLAttributes<HTMLOListElement>;

export function TableOfContents({ className, ...rest }: Props): JSX.Element {
  return (
    <ol className={className} {...rest}>
      {navItems.map((item) => {
        return <MenuItem key={item.target} value={item} />;
      })}
    </ol>
  );
}

function MenuItem({ value }: { value: NavItem }): JSX.Element {
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
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-left after:scale-x-0 after:bg-accent
          after:transition-transform
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

function SubMenu({ values }: { values: NavItem[] }): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            className={`
              mb-3 ml-1 font-sans text-xs tracking-wider text-muted uppercase
              last:-mb-1
            `}
            key={value.target}
          >
            <a
              className={`
                relative inline-block origin-left transform-gpu pb-1
                transition-all
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-bottom-left after:scale-x-0
                after:bg-accent after:transition-transform
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
