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
        size="small"
        title="Frank's Book Log"
        titleClasses={`
          text-3xl leading-8
          [text-shadow:1px_1px_2px_black]
          tablet:text-4xl tablet:leading-10
          laptop:text-5xl laptop:leading-10
          desktop:text-6xl desktop:leading-10
        `}
      />
      <nav className={`mx-auto max-w-(--breakpoint-desktop) px-container`}>
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ol
          className={`
            -mx-4 grid grid-cols-2 grid-rows-[auto_1fr] flex-wrap gap-x-2
            gap-y-2
            tablet:mx-0 tablet:flex tablet:items-baseline tablet:gap-x-8
            tablet:gap-y-4
            min-[905px]:gap-x-9
            laptop:gap-x-11 laptop:gap-y-6
            desktop:gap-x-16 desktop:gap-y-12
          `}
        >
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
              mx-auto w-full max-w-button transform-gpu bg-default py-5
              text-center font-sans text-xs font-semibold tracking-wide
              text-accent uppercase transition-all
              hover:scale-105 hover:bg-accent hover:text-inverse
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
