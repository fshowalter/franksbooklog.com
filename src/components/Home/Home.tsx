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
        titleClasses={`
          text-4xl leading-8
          [text-shadow:1px_1px_2px_black]
          tablet:text-5xl tablet:leading-10
          desktop:text-7xl desktop:leading-10
        `}
      />
      <nav className={`mx-auto max-w-(--breakpoint-max) px-container`}>
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ol
          className={`
            -mx-4 flex flex-wrap justify-center
            min-[900px]:-mx-4
            desktop:justify-between desktop:gap-y-4
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
