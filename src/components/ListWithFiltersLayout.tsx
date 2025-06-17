import { type JSX, type ReactNode, useState } from "react";

import { Layout } from "./Layout";

type Props = {
  backdrop: React.ReactNode;
  filters: React.ReactNode;
  hasBackdrop?: boolean;
  list: React.ReactNode;
  listHeaderButtons?: React.ReactNode;
  subNav?: React.ReactNode;
  totalCount: number;
};

export function ListHeaderButton({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-x-4 text-nowrap bg-default uppercase text-accent">
      <a
        className="block px-4 py-2 hover:bg-accent hover:text-inverse"
        href={href}
      >
        {text}
      </a>
    </div>
  );
}

export function ListWithFiltersLayout({
  backdrop,
  filters,
  hasBackdrop = true,
  list,
  listHeaderButtons,
  subNav,
  totalCount,
  ...rest
}: Props): JSX.Element {
  const [filtersVisible, toggleFilters] = useState(false);

  return (
    <Layout className="bg-subtle" hasBackdrop={hasBackdrop} {...rest}>
      {backdrop}
      {subNav && subNav}
      <div className="mx-auto flex flex-col items-center bg-default">
        <div className="mx-auto flex w-full flex-col items-stretch">
          <div className="flex grow flex-col bg-subtle">
            <div className="relative tablet:px-12 tablet-landscape:px-0">
              <div className="relative z-10 row-start-1 bg-default text-xs tablet:-mx-12 tablet:px-0 tablet-landscape:col-span-3 tablet-landscape:mx-0 tablet-landscape:w-full">
                <ListHeader
                  filtersVisible={filtersVisible}
                  listHeaderButtons={listHeaderButtons}
                  onToggleFilters={() => {
                    toggleFilters(!filtersVisible);
                  }}
                  totalCount={totalCount}
                />
              </div>
              <div className="mx-auto max-w-(--breakpoint-max) grid-cols-[1fr_48px_minmax(398px,33%)] tablet-landscape:grid tablet-landscape:grid-rows-[auto_1fr]">
                <div
                  className="relative z-10 col-start-3 row-span-2 row-start-2 grid min-w-[320px] text-sm transition-[grid-template-rows] duration-300 ease-in-out tablet-landscape:mr-12 tablet-landscape:block tablet-landscape:py-24 tablet-landscape:pb-12 tablet-landscape:shadow-none desktop:mr-20"
                  style={{
                    gridTemplateRows: filtersVisible ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="w-full bg-subtle text-sm tablet:pt-12 tablet:text-base tablet-landscape:overflow-visible tablet-landscape:bg-default tablet-landscape:px-container tablet-landscape:pt-0 desktop:px-8">
                      <fieldset className="flex flex-col gap-5 bg-group px-container py-10 tablet:gap-8 tablet:bg-default tablet-landscape:mt-0 tablet-landscape:gap-12 tablet-landscape:px-0">
                        <legend className="hidden w-full py-10 font-sans text-xs font-bold uppercase tracking-wide text-subtle tablet-landscape:block tablet-landscape:shadow-bottom">
                          Filter & Sort
                        </legend>
                        {filters}
                      </fieldset>
                    </div>
                  </div>
                </div>

                <div className="col-start-1 row-start-2 pb-10 tablet-landscape:pl-12 desktop:pl-20">
                  {list}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ListHeader({
  filtersVisible,
  listHeaderButtons,
  onToggleFilters,
  totalCount,
}: {
  filtersVisible: boolean;
  listHeaderButtons?: ReactNode;
  onToggleFilters: () => void;
  totalCount: number;
}): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-max) flex-wrap items-baseline justify-between gap-x-4 gap-y-5 px-container py-10 font-sans font-medium uppercase tracking-wide text-subtle">
      <span className="block pr-4">
        <span className="font-semibold text-default">
          {totalCount.toLocaleString()}
        </span>{" "}
        Results
      </span>
      {listHeaderButtons && (
        <div className="ml-auto flex w-1/2 flex-wrap justify-end gap-4">
          {listHeaderButtons}
        </div>
      )}
      <button
        className={`ml-auto flex justify-center gap-x-4 text-nowrap px-4 py-2 uppercase text-muted shadow-all tablet-landscape:hidden`}
        onClick={onToggleFilters}
        style={{
          backgroundColor: filtersVisible
            ? "var(--bg-subtle)"
            : "var(--bg-canvas)",
        }}
      >
        Filter & Sort
      </button>
    </div>
  );
}
