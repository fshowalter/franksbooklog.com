import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";

export function Mast({
  hasBackdrop,
  hideLogo,
}: {
  hasBackdrop: boolean;
  hideLogo: boolean;
}) {
  return (
    <header
      className="z-20 flex w-full items-center justify-between px-container py-4 tablet:p-6 desktop:inset-x-0 desktop:z-40 desktop:flex-row desktop:flex-wrap desktop:px-16 desktop:py-8 desktop:text-left"
      style={{
        position: hasBackdrop ? "absolute" : "static",
      }}
    >
      {hideLogo ? <div /> : <Logo className="mt-2 tablet:mt-0" />}
      <div className="flex items-center">
        <nav className="hidden w-full desktop:block desktop:w-auto">
          <ul className={`flex flex-wrap justify-start gap-x-6 text-xl`}>
            {navItems.map((item) => {
              return <NavListItem key={item.target} value={item} />;
            })}
          </ul>
        </nav>
        <SearchButton />
        <input className="hidden" id="mobile-nav" type="checkbox" />
        <label className="hamburger-icon desktop:hidden" htmlFor="mobile-nav">
          <span
            className="hamburger-icon-bars"
            style={{ background: "var(--fg-default)" }}
          />
        </label>
        <ul className="hamburger-menu flex flex-col items-start gap-y-5 text-left text-inverse desktop:hidden">
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
    <li className="block w-1/2 whitespace-nowrap text-2xl">
      <a href={value.target}>{value.text}</a>
      <SubMenu values={value.subItems} />
    </li>
  );
}

function NavListItem({ value }: { value: NavItem }): JSX.Element {
  return (
    <li className="block whitespace-nowrap tracking-serif-wide">
      <a
        className={`text-inherit transition-all duration-500 ease-in-out hover:text-accent`}
        href={value.target}
      >
        {value.text}
      </a>
    </li>
  );
}

function SearchButton() {
  return (
    <div className="search-button z-[1000]">
      <button
        aria-keyshortcuts="Control+K"
        aria-label="Search"
        className="flex items-center justify-between overflow-hidden text-sm leading-6 ring-default desktop:ml-6"
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

function SubMenu({ values }: { values: NavItem[] }) {
  if (values.length === 0) {
    return false;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            className="mb-2 font-sans text-xs uppercase tracking-wide text-inverse-subtle"
            key={value.target}
          >
            <a href={value.target}>{value.text}</a>
          </li>
        );
      })}
    </ol>
  );
}
