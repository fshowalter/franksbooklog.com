import { Logo } from "./Logo";
import type { NavItem } from "./navItems";
import { navItems } from "./navItems";

export function Mast({
  hideLogo,
  hasBackdrop,
}: {
  hideLogo: boolean;
  hasBackdrop: boolean;
}) {
  return (
    <header
      className="z-20 flex w-full items-center justify-between px-container py-4 tablet:p-6 desktop:inset-x-0 desktop:z-40 desktop:flex-row desktop:flex-wrap desktop:px-16 desktop:py-8 desktop:text-left"
      style={{
        position: hasBackdrop ? "absolute" : "static",
      }}
    >
      {hideLogo ? <div /> : <Logo />}
      <div className="flex items-center">
        <nav className="hidden w-full desktop:block desktop:w-auto">
          <ul className={`flex flex-wrap justify-start gap-x-6 text-xl`}>
            {navItems.map((item) => {
              return <NavListItem key={item.target} value={item} />;
            })}
          </ul>
        </nav>
        <SearchButton />
        <input type="checkbox" id="mobile-nav" className="hidden" />
        <label htmlFor="mobile-nav" className="hamburger-icon desktop:hidden">
          <span
            style={{ background: hasBackdrop ? "#fff" : "var(--fg-default)" }}
            className="hamburger-icon-bars"
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

function SubMenu({ values }: { values: NavItem[] }): JSX.Element | null {
  if (values.length === 0) {
    return null;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            key={value.target}
            className="mb-2 font-sans text-xs uppercase tracking-wide text-inverse-subtle"
          >
            <a href={value.target}>{value.text}</a>
          </li>
        );
      })}
    </ol>
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
    <div className="z-[1000]">
      <button
        data-open-modal
        disabled
        aria-label="Search"
        aria-keyshortcuts="Control+K"
        className="flex items-center justify-between overflow-hidden text-sm leading-6 ring-default desktop:ml-6"
        type="button"
        title="Search: Control+K"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 desktop:size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}
