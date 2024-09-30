import { Backdrop, SolidBackdrop } from "../Backdrop";
import { Layout } from "../Layout";
import { SubHeading } from "../SubHeading";
import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";

export interface Props {
  values: ListItemValue[];
  backdropImageProps: BackdropImageProps;
}

export function Home({ values, backdropImageProps }: Props): JSX.Element {
  return (
    <Layout hideLogo={true} addGradient={false} className="bg-subtle pb-8">
      <SolidBackdrop
        title="Frank's Book Log"
        deck="Literature is a relative term."
        titleStyle="text-default text-4xl desktop:text-7xl"
      />
      <nav className="mx-auto max-w-screen-max bg-subtle px-container">
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ol className="flex flex-wrap justify-center gap-x-[3%] gap-y-[6vw] desktop:justify-between">
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
        <div className="flex py-10">
          <a
            href="/reviews/"
            className="hover:bg-accent mx-auto w-full max-w-button bg-default py-5 text-center font-sans text-xs font-semibold uppercase tracking-wide text-accent hover:text-inverse"
          >
            All Reviews
          </a>
        </div>
      </nav>
    </Layout>
  );
}
