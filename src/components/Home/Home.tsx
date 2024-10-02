import { SolidBackdrop } from "../Backdrop";
import { Layout } from "../Layout";
import { SubHeading } from "../SubHeading";
import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  return (
    <Layout hideLogo={true} className="bg-subtle pb-8">
      <SolidBackdrop
        title="Frank's Book Log"
        deck="Literature is a relative term."
        titleStyle="text-default text-4xl desktop:text-7xl"
      />
      <nav className="mx-auto max-w-screen-max bg-[#f6f6f6] tablet:bg-subtle tablet:px-container">
        <SubHeading as="h2" className="px-container tablet:px-0">
          Latest Reviews
        </SubHeading>
        <ol className="flex flex-wrap justify-center gap-x-[4%] gap-y-[6vw] px-[2%] tablet:gap-x-[3%] tablet:px-0 desktop:justify-between desktop:gap-x-[2%]">
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
            href="/reviews/"
            className="mx-auto w-full max-w-button bg-default py-5 text-center font-sans text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent hover:text-inverse"
          >
            All Reviews
          </a>
        </div>
      </nav>
    </Layout>
  );
}
