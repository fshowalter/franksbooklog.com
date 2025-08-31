import type { BackdropImageProps } from "~/api/backdrops";
import type { MoreReviewsValue } from "~/components/MoreReviews";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout/Layout";
import { LongFormText } from "~/components/LongFormText";
import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

export type Props = {
  backdropImageProps: BackdropImageProps;
  content: string | undefined;
  deck: string;
  recentReviews: MoreReviewsValue[];
  title: string;
};

export function Article({
  backdropImageProps,
  content,
  deck,
  recentReviews,
  title,
}: Props): React.JSX.Element {
  return (
    <Layout hasBackdrop={true}>
      <article>
        <Backdrop
          centerText={true}
          deck={deck}
          imageProps={backdropImageProps}
          title={title}
        />
        <section className="flex flex-col items-center pt-16 pb-32">
          <div className="px-container">
            <LongFormText className={`max-w-prose`} text={content} />
          </div>
        </section>
      </article>
      <div
        className={`
          flex w-full flex-col items-center gap-y-12 bg-subtle pt-16 pb-32
          tablet:pt-8
          desktop:gap-y-24
        `}
        data-pagefind-ignore
      >
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            <a
              className={`
                relative -mb-1 inline-block transform-gpu pb-1
                transition-transform
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-bottom-right after:scale-x-0
                after:bg-(--fg-accent) after:transition-transform
                hover:after:scale-x-100
              `}
              href={`/reviews/`}
            >
              Recent <span className={`text-accent`}>Reviews</span>
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
    </Layout>
  );
}
