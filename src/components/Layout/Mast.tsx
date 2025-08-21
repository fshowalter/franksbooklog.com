import type { JSX } from "react";
import type React from "react";

import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";

export function Mast({
  addGradient,
  hasBackdrop,
  hideLogo,
}: {
  addGradient: boolean;
  hasBackdrop: boolean;
  hideLogo: boolean;
}) {
  return (
    <header
      className={`
        group z-30 flex w-full items-center justify-between px-container py-4
        tablet:py-6
        laptop:inset-x-0 laptop:z-40 laptop:flex-row laptop:flex-wrap
        laptop:px-16 laptop:py-8 laptop:text-left
        ${
          hasBackdrop
            ? `
              absolute
              [--mast-color:#fff]
            `
            : `
              static
              [--mast-color:var(--fg-default)]
            `
        }
        text-(--mast-color)
      `}
      style={{
        backgroundImage: addGradient
          ? "linear-gradient(to bottom, rgba(0,0,0,.85), transparent 95%)"
          : "",
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
      </div>
    </header>
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
    <li
      className={`
        block leading-10 tracking-serif-wide whitespace-nowrap
        transition-transform
        [body.nav-open_&]:opacity-0
      `}
    >
      <a
        className={`
          relative block text-inherit
          after:absolute after:bottom-1 after:left-0 after:h-px after:w-full
          after:origin-center after:scale-x-0 after:bg-(--mast-color)/75
          after:transition-transform
          hover:after:scale-x-100
        `}
        href={value.target}
        style={{
          textShadow: hasBackdrop ? "1px 1px 2px black" : "",
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
        [body.nav-open_&]:!text-[#fff]
      `}
    >
      <button
        aria-keyshortcuts="Control+K"
        aria-label="Search"
        className={`
          flex size-10 transform-gpu cursor-pointer items-center justify-center
          overflow-hidden text-sm leading-6 ring-default transition-transform
          hover:scale-105
          laptop:ml-6
        `}
        data-open-modal
        disabled
        suppressHydrationWarning
        title="Search: Control+K"
        type="button"
      >
        <svg
          aria-hidden="true"
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
