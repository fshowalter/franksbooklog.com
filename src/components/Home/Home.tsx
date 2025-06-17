import type { JSX } from "react";

import type { BackdropImageProps } from "~/api/backdrops";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout";
import { SubHeading } from "~/components/SubHeading";

import type { ListItemValue } from "./HomeListItem";

import { HomeListItem } from "./HomeListItem";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  values: ListItemValue[];
};

export function Home({ backdropImageProps, deck, values }: Props): JSX.Element {
  return (
    <Layout className="bg-subtle pb-8" hasBackdrop={true} hideLogo={true}>
      <Backdrop
        deck={deck}
        imageProps={backdropImageProps}
        title="Frank's Book Log"
        titleStyle="[text-shadow:1px_1px_2px_var(--bg-footer)] text-4xl desktop:text-7xl"
      />
      <nav className={`
        mx-auto max-w-(--breakpoint-max)
        tablet:px-container
      `}>
        <SubHeading as="h2" className={`
          px-container
          tablet:px-0
        `}>
          Latest Reviews
        </SubHeading>
        <ol className={`
          flex flex-wrap justify-center gap-x-[4%] gap-y-[6vw] px-[4%]
          tablet:gap-x-[3%] tablet:px-0
          desktop:justify-between desktop:gap-x-[1%]
        `}>
          {values.map((value, index) => {
            return (
              <HomeListItem
                eagerLoadCoverImage={index === 0}
                key={value.sequence}
                value={value}
              />
            );
          })}
        </ol>
        <div className="flex px-container py-10">
          <a
            className={`
              mx-auto w-full max-w-button bg-default py-5 text-center font-sans
              text-xs font-semibold tracking-wide text-accent uppercase
              hover:bg-accent hover:text-inverse
            `}
            href="/reviews/"
          >
            All Reviews
          </a>
        </div>
      </nav>
    </Layout>
  );
}
