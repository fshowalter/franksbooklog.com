import type { ReviewWithContent } from "~/api/reviews";

import { Grade } from "~/components/Grade";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { SubHeading } from "~/components/SubHeading";
import { toSentenceArray } from "~/utils";

type Props = {
  values: ReviewWithContent["includedWorks"];
};

export function IncludedWorks({ values }: Props) {
  return (
    <>
      <SubHeading as="h2" className="text-center shadow-bottom">
        Included Works
      </SubHeading>
      <div className={`
        w-full max-w-popout bg-subtle px-container py-8
        tablet:pt-12
      `}>
        <ul className="">
          {values.map((value) => (
            <li
              className={`
                relative mb-1 bg-default px-container py-4
                last-of-type:mb-0
                has-[a:hover]:bg-stripe
                tablet:gap-x-6 tablet:px-4
                desktop:px-6
              `}
              key={value.slug}
            >
              <Title value={value} />{" "}
              <div className="font-sans text-xs leading-6 text-muted">
                <span className="font-light text-subtle">by</span>{" "}
                {toSentenceArray(value.authors.map((author) => author.name))}
              </div>
              <div className="py-1">
                <ListItemKindAndYear
                  kind={value.kind}
                  year={value.yearPublished}
                />
              </div>
              <Grade className="mt-1" height={16} value={value.grade} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Title({ value }: { value: ReviewWithContent["includedWorks"][0] }) {
  if (value.grade) {
    return (
      <a
        className={`
          font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:size-full
          after:opacity-0
        `}
        href={`/reviews/${value.slug}/`}
      >
        {value.title}
      </a>
    );
  }

  return (
    <span className="font-sans text-sm font-normal text-muted">
      {value.title}
    </span>
  );
}
