import type { CoverImageProps } from "~/assets/covers";
import type { GradeText } from "~/utils/grades";

import { Grade } from "~/components/grade/Grade";
import { formatTitleAuthors } from "~/utils/formatTitleAuthors";

type ReviewCardValue = {
  authors?: {
    name: string;
    notes: string | undefined;
    slug: string;
    sortName: string;
  }[];
  coverImageProps: CoverImageProps;
  coverImageSizes: string;
  date?: Date;
  excerptHtml: string;
  grade: GradeText;
  kind: string;
  otherAuthors?: {
    name: string;
    notes: string | undefined;
  }[];
  slug: string;
  title: string;
  titleYear: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function ReviewCard({
  value,
}: {
  value: ReviewCardValue;
}): React.JSX.Element {
  return (
    <li
      className={`
        group/list-item relative row-span-2 grid transform-gpu grid-rows-subgrid
        gap-y-0 bg-default py-6 pr-8 pl-4 transition-transform duration-500
        tablet-landscape:has-[a:hover]:-translate-y-2
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          row-span-2 grid grid-cols-1 grid-rows-subgrid gap-x-[5%]
          @min-[1128px]/card-list:flex @min-[1128px]/card-list:flex-row
        `}
      >
        <div
          className={`
            relative row-start-1 flex shrink-0 justify-center self-end
            @min-[1128px]/card-list:w-1/4 @min-[1128px]/card-list:self-start
            @min-[1128px]/card-list:drop-shadow-md
          `}
        >
          <div
            className={`
              absolute top-[2.5%] bottom-[2.5%] left-0 w-full overflow-hidden
              bg-default bg-cover bg-center clip-path-cover
              after:absolute after:size-full after:backdrop-blur-sm
              after:clip-path-cover
              @min-[500px]/card:hidden
            `}
            style={{
              backgroundColor: "var(--background-color-default)",
              backgroundImage: `linear-gradient(90deg, rgba(var(--bg-default-rgb),1) 0%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 30%, rgba(var(--bg-default-rgb),0) 50%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 70%, rgba(var(--bg-default-rgb),1) 100%), url(${value.coverImageProps.src})`,
            }}
          ></div>
          <div
            className={`
              relative w-1/2 max-w-[200px] shrink-0 self-start overflow-hidden
              rounded-sm shadow-xl transition-transform
              after:absolute after:top-0 after:left-0 after:z-above
              after:size-full after:bg-default after:opacity-15
              after:transition-opacity
              group-has-[a:hover]/list-item:after:opacity-0
              @min-[1128px]/card-list:w-full
            `}
          >
            <div
              className={`
                relative
                after:absolute after:top-0 after:left-0 after:z-above
                after:block after:size-full after:rounded-[2.5px]
                after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
                after:mix-blend-multiply
              `}
            >
              <div
                className={`
                  relative z-above
                  before:absolute before:top-0 before:left-0 before:z-above
                  before:block before:size-full before:rounded-[2.5px]
                  before:bg-[url(/assets/spine-light.png)]
                  before:bg-size-[100%_100%]
                  after:absolute after:top-0 after:left-0 after:block
                  after:size-full after:rounded-[2.5px]
                  after:bg-[url(/assets/spot.png)] after:bg-size-[100%_100%]
                  after:mix-blend-soft-light
                `}
              >
                <img
                  {...value.coverImageProps}
                  alt=""
                  className={`
                    transform-gpu rounded-[2.5px] bg-default
                    transition-transform duration-500
                    group-has-[a:hover]/list-item:scale-110
                  `}
                  decoding="async"
                  loading="lazy"
                  sizes={value.coverImageSizes}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`
            row-start-2 mt-4 flex flex-col gap-y-2 px-[8%]
            @min-[1128px]/card-list:mt-0 @min-[1128px]/card-list:px-0
          `}
        >
          {value.date && (
            <div
              className={`
                mb-1 font-sans text-xs/4 font-normal tracking-wider text-subtle
                uppercase
                laptop:tracking-wide
              `}
            >
              {dateFormatter.format(value.date)}
            </div>
          )}
          <a
            className={`
              block text-2xl font-medium transition-colors duration-500
              after:absolute after:top-0 after:left-0 after:z-above
              after:size-full
              hover:text-accent
              hover:before:opacity-0
            `}
            href={`/reviews/${value.slug}/`}
          >
            {value.title}
          </a>
          {value.authors && (
            <div className="-mt-2">{formatTitleAuthors(value.authors)}</div>
          )}
          {value.otherAuthors && value.otherAuthors.length > 0 && (
            <div className="-mt-2">
              <span className="text-subtle">with </span>
              {formatTitleAuthors(value.otherAuthors)}
            </div>
          )}
          <div
            className={`
              font-sans text-sm/4 font-normal tracking-prose text-subtle
            `}
          >
            {value.titleYear} | {value.kind}
          </div>
          <div>
            <Grade className="py-1" height={24} value={value.grade} />
          </div>
          <div
            className={`
              rendered-markdown mb-6 text-lg/normal tracking-prose text-muted
            `}
            // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
            dangerouslySetInnerHTML={{ __html: value.excerptHtml }}
          />
        </div>
      </div>
    </li>
  );
}
