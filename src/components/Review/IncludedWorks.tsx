import type { ReviewWithContent } from "src/api/reviews";

import { toSentenceArray } from "../../utils";
import { Grade } from "../Grade";

interface Props {
  values: ReviewWithContent["includedWorks"];
}

export function IncludedWorks({ values }: Props) {
  return (
    <>
      <h3 className="w-full max-w-popout px-gutter text-md font-normal text-subtle shadow-bottom">
        Included Works
        <div className="spacer-y-2" />
      </h3>
      <ul className="w-full max-w-popout">
        {values.map((value) => (
          <li
            key={value.slug}
            className="flex flex-col px-gutter py-4 even:bg-subtle"
          >
            <a
              href={`/reviews/${value.slug}/`}
              className="text-md font-semibold text-accent"
            >
              {value.title}
            </a>{" "}
            <div>
              <span className="text-subtle">by</span>{" "}
              {toSentenceArray(value.authors.map((author) => author.name))}
            </div>
            <Grade value={value.grade} height={16} />
          </li>
        ))}
      </ul>
    </>
  );
}
