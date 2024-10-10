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
      <SubHeading as="h2" className="shadow-bottom">
        Included Works
      </SubHeading>
      <ul className="w-full max-w-popout">
        {values.map((value) => (
          <li className="py-4 shadow-bottom" key={value.slug}>
            <a
              className="font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 hover:underline"
              href={`/reviews/${value.slug}/`}
            >
              {value.title}
            </a>{" "}
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
    </>
  );
}
