import { SolidBackdrop } from "src/components/Backdrop";
import { Layout } from "src/components/Layout";
import { LongFormText } from "src/components/LongFormText";
import type { MoreReviewsValue } from "src/components/MoreReviews";
import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

export interface Props {
  content: string | null;
  title: string;
  deck: string;
  recentReviews: MoreReviewsValue[];
}

export function Article({
  title,
  content,
  recentReviews,
  deck,
}: Props): JSX.Element {
  return (
    <Layout>
      <article>
        <SolidBackdrop title={title} deck={deck} />
        <section className="flex flex-col items-center pb-32 pt-16">
          <div className="px-container">
            <LongFormText text={content} className="max-w-prose" />
          </div>
        </section>
      </article>
      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            Recent{" "}
            <a href="/reviews/" className="text-accent">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
    </Layout>
  );
}
