import type { ReviewWithContent } from "src/api/reviews";

import { toSentenceArray } from "../../utils";
import { Grade } from "../Grade";
import { ListItemKindAndYear } from "../ListItemKindAndYear";
import { SubHeading } from "../SubHeading";

interface Props {
  values: ReviewWithContent["includedWorks"];
}

export function IncludedWorks({ values }: Props) {
  return (
    <>
      <SubHeading as="h2" className="shadow-bottom">
        Included Works
      </SubHeading>
      <ul className="w-full max-w-popout">
        {values.map((value) => (
          <li key={value.slug} className="py-4 shadow-bottom">
            <a
              href={`/reviews/${value.slug}/`}
              className="font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 hover:underline"
            >
              {value.title}
            </a>{" "}
            <div className="font-sans text-xs leading-6 text-muted">
              <span className="font-light text-subtle">by</span>{" "}
              {toSentenceArray(value.authors.map((author) => author.name))}
            </div>
            <div className="py-1">
              <ListItemKindAndYear
                year={value.yearPublished}
                kind={value.kind}
              />
            </div>
            <Grade value={value.grade} height={16} className="mt-1" />
          </li>
        ))}
      </ul>
    </>
  );
}
