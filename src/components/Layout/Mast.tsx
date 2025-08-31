import type React from "react";

import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";
import { TableOfContents } from "./TableOfContents";

export function Mast({
  addGradient,
  hasBackdrop,
  hideLogo,
}: {
  addGradient: boolean;
  hasBackdrop: boolean;
  hideLogo: boolean;
}): React.JSX.Element {
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
        <HamburgerMenu hasBackdrop={hasBackdrop} />
      </div>
    </header>
  );
}

function HamburgerMenu({
  hasBackdrop,
}: {
  hasBackdrop: boolean;
}): React.JSX.Element {
  return (
    <>
      <div
        className={`
          invisible fixed inset-0 bg-[rgba(0,0,0,.4)] opacity-0
          transition-opacity duration-200
          [body.nav-open_&]:tablet:visible
          [body.nav-open_&]:tablet:z-nav-backdrop
          [body.nav-open_&]:tablet:opacity-100
        `}
        data-nav-backdrop
      />
      <button
        aria-controls="nav-menu"
        aria-expanded="false"
        aria-label="Toggle navigation menu"
        className={`
          relative z-40 ml-2 flex h-10 w-10 transform-gpu cursor-pointer
          items-center justify-center transition-transform
          hover:scale-110
          laptop:hidden
        `}
        data-nav-toggle
        type="button"
      >
        <span
          aria-hidden="true"
          className={`
            relative flex h-0.5 w-6 origin-center transform-gpu transition-all
            duration-200 ease-in-out
            before:absolute before:-top-2 before:block before:h-0.5 before:w-6
            before:bg-inherit before:transition before:duration-200
            before:ease-in-out
            after:absolute after:-bottom-2 after:block after:h-0.5 after:w-6
            after:bg-inherit after:transition after:duration-200
            after:ease-in-out
            [body.nav-open_&]:transform-[rotate(45deg)]
            [body.nav-open_&]:!bg-[var(--fg-default)]
            [body.nav-open_&]:before:top-0
            [body.nav-open_&]:before:transform-[rotate(90deg)]
            [body.nav-open_&]:after:bottom-0
            [body.nav-open_&]:after:transform-[rotate(90deg)]
          `}
          style={{
            backgroundColor: hasBackdrop ? "#fff" : "var(--fg-default)",
          }}
        />
      </button>
      <nav aria-label="Main navigation">
        <div
          className={`
            invisible fixed top-0 right-0 h-full w-0
            transform-[translateX(100%)] overflow-hidden bg-canvas text-left
            text-default opacity-0 duration-200 ease-in-out
            tablet:max-w-[35vw]
            laptop:max-w-[25vw]
            [body.nav-open_&]:visible [body.nav-open_&]:bottom-0
            [body.nav-open_&]:z-nav-menu [body.nav-open_&]:h-full
            [body.nav-open_&]:w-full [body.nav-open_&]:transform-[translateX(0)]
            [body.nav-open_&]:overflow-y-auto [body.nav-open_&]:pt-20
            [body.nav-open_&]:pr-[16%] [body.nav-open_&]:pb-5
            [body.nav-open_&]:pl-[12%] [body.nav-open_&]:opacity-100
            [body.nav-open_&]:drop-shadow-2xl [body.nav-open_&]:tablet:px-10
            [body.nav-open_&]:tablet:pt-40 [body.nav-open_&]:laptop:px-20
          `}
          data-nav-menu
          id="nav-menu"
        >
          <TableOfContents />
        </div>
      </nav>
    </>
  );
}

function NavListItem({
  hasBackdrop,
  value,
}: {
  hasBackdrop: boolean;
  value: NavItem;
}): React.JSX.Element {
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
          after:transition-transform after:duration-500
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

function SearchButton(): React.JSX.Element {
  return (
    <div
      className={`
        z-1000 transition-colors
        [body.nav-open_&]:!text-default
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
