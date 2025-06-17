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
        z-20 flex w-full items-center justify-between px-container py-4
        tablet:p-6
        desktop:inset-x-0 desktop:z-40 desktop:flex-row desktop:flex-wrap
        desktop:px-16 desktop:py-8 desktop:text-left
      `}
      style={{
        backgroundImage: addGradient
          ? "linear-gradient(to bottom, rgba(0,0,0,.85), transparent 95%)"
          : "unset",
        color: hasBackdrop ? "#fff" : "var(--fg-default)",
        position: staticMast ? "static" : "absolute",
      }}
    >
      {hideLogo ? <div /> : <Logo className="" />}
      <div className="flex items-center">
        <nav
          className={`
          hidden w-full
          desktop:block desktop:w-auto
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
        <input className="hidden" id="mobile-nav" type="checkbox" />
        <label
          className={`
          hamburger-icon
          desktop:hidden
        `}
          htmlFor="mobile-nav"
        >
          <span
            className="hamburger-icon-bars"
            style={{
              backgroundColor: hasBackdrop ? "#fff" : "var(--fg-default)",
            }}
          />
        </label>
        <ul
          className={`
          hamburger-menu flex flex-col items-start gap-y-5 text-left
          text-inverse
          desktop:hidden
        `}
        >
          {navItems.map((item) => {
            return <MenuItem key={item.target} value={item} />;
          })}
        </ul>
      </div>
    </header>
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
    <li className="mast-item block tracking-serif-wide whitespace-nowrap">
      <a
        className={`
          text-inherit transition-all duration-500 ease-in-out
          ${hasBackdrop ? `hover:bg-[rgba(0,0,0,.50)]` : `hover:text-accent`}
        `}
        href={value.target}
        style={{
          textShadow: hasBackdrop ? "1px 1px 2px black" : "unset",
        }}
      >
        {value.text}
      </a>
    </li>
  );
}

function SearchButton() {
  return (
    <div className="search-button z-1000">
      <button
        aria-keyshortcuts="Control+K"
        aria-label="Search"
        className={`
          flex size-10 items-center justify-center overflow-hidden text-sm
          leading-6 ring-default
          desktop:ml-6
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
