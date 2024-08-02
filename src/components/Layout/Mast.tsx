import { NavListItems } from "./NavListItems";

export function Mast({ currentPath }: { currentPath: string }) {
  return (
    <header className="flex flex-col items-center gap-6 bg-default px-pageMargin py-6 text-center shadow-bottom desktop:sticky desktop:top-4 desktop:z-40 desktop:flex-row desktop:justify-between desktop:gap-8 desktop:py-5 desktop:text-left max:justify-center max:py-8">
      <div className="items-inherit justify-items-inherit flex flex-col max:absolute max:left-[var(--page-margin-width)]">
        <h1 className="whitespace-nowrap text-[1.5625rem] font-normal leading-8">
          <a className="text-default" href="/">
            Frank&apos;s Book Log
          </a>
        </h1>
        <p className="w-full text-sm italic leading-4 text-muted desktop:pl-px">
          Literature is a relative term.
        </p>
      </div>
      <div className="w-full max-w-prose desktop:order-4 desktop:w-auto max:absolute max:right-[var(--page-margin-width)]">
        <button
          data-open-modal
          disabled
          aria-label="Search"
          aria-keyshortcuts="Control+K"
          className="safari-border-radius-fix flex w-full items-center overflow-hidden rounded-md text-sm leading-6 text-subtle ring-1 ring-border hover:ring-accent"
        >
          <kbd className="ml-auto mt-px hidden min-h-6 flex-none items-center bg-subtle pl-3 pr-4 font-mono text-sm font-light opacity-70 desktop:flex">
            <kbd className="text-md leading-5">Ctrl</kbd>
            <kbd className="text-sm">K</kbd>
          </kbd>
          <svg
            className="mr-2 size-10 flex-none border-0 border-r border-default bg-subtle fill-subtle px-3 py-1 desktop:w-4 desktop:border-r-0 desktop:bg-unset desktop:px-0"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"
            />
            <path
              fillRule="evenodd"
              d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <span className="flex items-baseline whitespace-nowrap p-2 text-base opacity-70 desktop:hidden">
            Quick search...
          </span>
        </button>
      </div>
      <nav className="w-full desktop:w-auto">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-accent tablet:gap-x-6 desktop:flex-nowrap desktop:justify-start">
          <NavListItems
            activeClassName="text-muted"
            currentPath={currentPath}
          />
        </ul>
      </nav>
    </header>
  );
}
