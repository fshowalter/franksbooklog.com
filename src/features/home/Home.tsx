import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewCardProps } from "~/components/ReviewCard";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout/Layout";
import { ReviewCard } from "~/components/ReviewCard";
import { SubHeading } from "~/components/SubHeading";

export type HomeProps = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  values: ReviewCardProps[];
};

export function Home({
  backdropImageProps,
  deck,
  values,
}: HomeProps): React.JSX.Element {
  return (
    <Layout className="bg-subtle pb-8" hasBackdrop={true} hideLogo={true}>
      <Backdrop
        deck={deck}
        imageProps={backdropImageProps}
        title="Frank's Book Log"
        titleClasses={`
          text-[2rem] leading-10 font-extrabold
          [text-shadow:1px_1px_2px_rgba(0,0,0,.25)]
          tablet:text-4xl
          laptop:text-7xl
        `}
      />
      <nav
        className={`
          @container/home-list mx-auto max-w-(--breakpoint-desktop) px-container
        `}
      >
        <SubHeading as="h2">Latest Reviews</SubHeading>
        <ol
          className={`
            -mx-4 grid grid-rows-[auto_1fr] gap-x-[3%] gap-y-8
            @min-[700px]/home-list:grid-cols-2
          `}
        >
          {values.map((value) => {
            return <ReviewCard key={value.reviewSequence} value={value} />;
          })}
        </ol>
        <div
          className={`
            flex px-container py-10
            has-[a:hover]:drop-shadow-lg
          `}
        >
          <a
            className={`
              group/all-reviews mx-auto w-full max-w-button transform-gpu
              rounded-md bg-default pt-5 pb-4 text-center font-sans text-sm
              font-bold tracking-wide text-accent uppercase transition-all
              hover:scale-105 hover:bg-accent hover:text-inverse
            `}
            href="/reviews/"
          >
            <span
              className={`
                relative inline-block pb-1
                after:absolute after:bottom-0 after:left-0 after:h-0.5
                after:w-full after:origin-center after:scale-x-0
                after:transform-gpu after:bg-(--color-inverse)
                after:transition-transform after:duration-500
                group-hover/all-reviews:after:scale-x-100
              `}
            >
              All Reviews
            </span>
          </a>
        </div>
      </nav>
    </Layout>
  );
}
