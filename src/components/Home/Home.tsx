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
          desktop:text-6xl desktop:leading-10
        `}
      />
      <nav className={`mx-auto max-w-(--breakpoint-bp-max) px-container`}>
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ol
          className={`
            -mx-4 grid auto-rows-[auto_1fr] grid-cols-2 gap-x-2 gap-y-2
            tablet:grid-cols-3 tablet:gap-x-4 tablet:gap-y-4
            desktop:grid-cols-4 desktop:gap-x-8 desktop:gap-y-8
            bp-max:-mx-8 bp-max:grid-cols-6 bp-max:gap-y-12
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
