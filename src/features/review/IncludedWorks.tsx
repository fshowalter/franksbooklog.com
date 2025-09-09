import type { ReviewWithContent } from "~/api/reviews";

import { ListItemAuthors } from "~/components/list-item-authors/ListItemAuthors";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/list-item-kind-and-year/ListItemKindAndYear";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { SubHeading } from "~/components/sub-heading/SubHeading";

type Props = {
  values: ReviewWithContent["includedWorks"];
};

export function IncludedWorks({ values }: Props): React.JSX.Element {
  return (
    <>
      <SubHeading as="h2" className="text-center shadow-bottom">
        Included Works
      </SubHeading>
      <div
        className={`
          w-full max-w-popout bg-subtle px-container py-8
          tablet:pt-12
        `}
      >
        <ul>
          {values.map((value) => (
            <li
              className={`
                relative mb-1 transform-gpu bg-default px-container py-4
                transition-transform
                last-of-type:mb-0
                has-[a:hover]:z-10 has-[a:hover]:scale-105
                has-[a:hover]:shadow-all has-[a:hover]:drop-shadow-2xl
                tablet:gap-x-6 tablet:px-4
                desktop:px-6
              `}
              key={value.slug}
            >
              <ListItemDetails>
                <ListItemTitle
                  slug={value.reviewed ? value.slug : undefined}
                  title={value.title}
                />
                <ListItemAuthors values={value.authors} />
                <ListItemKindAndYear kind={value.kind} year={value.workYear} />
                {value.grade && <ListItemGrade grade={value.grade} />}
              </ListItemDetails>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
