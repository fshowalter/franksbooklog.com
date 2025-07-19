import type { JSX } from "react";

import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";

export function Mast({
  addGradient,
  hasBackdrop,
  hideLogo,
  staticMast,
}: {
  addGradient: boolean;
  hasBackdrop: boolean;
  hideLogo: boolean;
  staticMast: boolean;
}) {
  return (
    <header
      className={`
        group/mast z-20 flex w-full items-center justify-between px-container
        py-4
        tablet:p-6
        laptop:inset-x-0 laptop:z-40 laptop:flex-row laptop:flex-wrap
        laptop:px-16 laptop:py-8 laptop:text-left
      `}
      style={{
        backgroundImage: addGradient
          ? "linear-gradient(to bottom, rgba(0,0,0,.85), transparent 95%)"
          : undefined,
        color: hasBackdrop ? "#fff" : "var(--fg-default)",
        position: staticMast ? "static" : "absolute",
      }}
    >
      {hideLogo ? <div /> : <Logo className="" />}
      <div className="flex items-center">
        <nav
          className={`
            hidden w-full
            laptop:block laptop:w-auto
          `}
        >
          <ul className={`flex flex-wrap justify-start gap-x-6 text-xl`}>
            {navItems.map((item) => {
              return (
                <NavListItem
                  hasBackdrop={hasBackdrop}
                  key={item.target}
                  value={item}
                />
              );
            })}
          </ul>
        </nav>
        <SearchButton />
        <HamburgerMenu hasBackdrop={hasBackdrop} />
      </div>
    </header>
  );
}

function HamburgerMenu({ hasBackdrop }: { hasBackdrop: boolean }) {
  return (
    <div className="group">
      <input className="hidden" id="nav" type="checkbox" />
      <label
        className={`
          relative z-40 ml-2 flex h-10 w-10 cursor-pointer items-center
          justify-center
          laptop:hidden
        `}
        htmlFor="nav"
      >
        <span
          className={`
            relative block h-0.5 w-6 origin-center
            transition-[top,bottom,transform] duration-200 ease-in-out
            group-has-[#nav:checked]/mast:transform-[rotate(45deg)]
            group-has-[#nav:checked]/mast:!bg-[#fff]
            before:absolute before:-top-2 before:block before:h-0.5 before:w-6
            before:bg-inherit before:transition before:duration-200
            before:ease-in-out
            group-has-[#nav:checked]/mast:before:top-0
            group-has-[#nav:checked]/mast:before:transform-[rotate(90deg)]
            after:absolute after:-bottom-2 after:block after:h-0.5 after:w-6
            after:bg-inherit after:transition after:duration-200
            after:ease-in-out
            group-has-[#nav:checked]/mast:after:bottom-0
            group-has-[#nav:checked]/mast:after:transform-[rotate(90deg)]
          `}
          style={{
            backgroundColor: hasBackdrop ? "#fff" : "var(--fg-default)",
          }}
        />
      </label>
      <ul
        className={`
          fixed top-0 right-0 z-20 flex h-full w-0 transform-[translateX(100%)]
          flex-col items-start gap-y-5 overflow-hidden bg-footer text-left
          text-inverse opacity-0 duration-200 ease-in-out
          group-has-[#nav:checked]/mast:bottom-0
          group-has-[#nav:checked]/mast:z-20
          group-has-[#nav:checked]/mast:h-full
          group-has-[#nav:checked]/mast:w-full
          group-has-[#nav:checked]/mast:transform-[translateX(0)]
          group-has-[#nav:checked]/mast:overflow-y-auto
          group-has-[#nav:checked]/mast:pt-20
          group-has-[#nav:checked]/mast:pr-[16%]
          group-has-[#nav:checked]/mast:pb-5
          group-has-[#nav:checked]/mast:pl-[12%]
          group-has-[#nav:checked]/mast:opacity-100
          tablet:max-w-[35vw]
          group-has-[#nav:checked]/mast:tablet:px-10
          group-has-[#nav:checked]/mast:tablet:py-40
          laptop:hidden
        `}
      >
        {navItems.map((item) => {
          return <MenuItem key={item.target} value={item} />;
        })}
      </ul>
    </div>
  );
}

function MenuItem({ value }: { value: NavItem }): JSX.Element {
  return (
    <li className="block w-1/2 text-2xl whitespace-nowrap">
      <a href={value.target}>{value.text}</a>
      <SubMenu values={value.subItems} />
    </li>
  );
}

function NavListItem({
  hasBackdrop,
  value,
}: {
  hasBackdrop: boolean;
  value: NavItem;
}): JSX.Element {
  return (
    <li className={`block tracking-serif-wide whitespace-nowrap`}>
      <a
        className={`
          text-inherit transition-all duration-500 ease-in-out
          ${
            hasBackdrop
              ? `
                to-50%
                hover:bg-linear-to-b hover:from-transparent hover:from-25%
                hover:via-[rgba(0,0,0,.8)] hover:to-transparent hover:to-75%
              `
              : `hover:text-accent`
          }
        `}
        href={value.target}
        style={{
          textShadow: hasBackdrop ? "1px 1px 2px black" : undefined,
        }}
      >
        {value.text}
      </a>
    </li>
  );
}

function SearchButton() {
  return (
    <div
      className={`
        z-1000
        group-has-[#nav:checked]/mast:!text-[#fff]
      `}
    >
      <button
        aria-keyshortcuts="Control+K"
        aria-label="Search"
        className={`
          flex size-10 items-center justify-center overflow-hidden text-sm
          leading-6 ring-default
          laptop:ml-6
        `}
        data-open-modal
        disabled
        suppressHydrationWarning
        title="Search: Control+K"
        type="button"
      >
        <svg
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
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
              mb-4 ml-1 font-sans text-xs tracking-wider text-inverse-subtle
              uppercase
              last:mb-0
            `}
            key={value.target}
          >
            <a href={value.target}>{value.text}</a>
          </li>
        );
      })}
    </ol>
  );
}
