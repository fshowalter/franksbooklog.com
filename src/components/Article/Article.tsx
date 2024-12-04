import type { JSX } from "react";

import type { MoreReviewsValue } from "~/components/MoreReviews";

import { SolidBackdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout";
import { LongFormText } from "~/components/LongFormText";
import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

export type Props = {
  content: string | undefined;
  deck: string;
  recentReviews: MoreReviewsValue[];
  title: string;
};

export function Article({
  content,
  deck,
  recentReviews,
  title,
}: Props): JSX.Element {
  return (
    <Layout>
      <article>
        <SolidBackdrop deck={deck} title={title} />
        <section className="flex flex-col items-center pb-32 pt-16">
          <div className="px-container">
            <LongFormText className="max-w-prose" text={content} />
          </div>
        </section>
      </article>
      <div
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
        data-pagefind-ignore
      >
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            Recent{" "}
            <a className="text-accent" href="/reviews/">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
    </Layout>
  );
}
