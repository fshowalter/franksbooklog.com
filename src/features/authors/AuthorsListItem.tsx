import { AvatarListItem } from "~/components/AvatarList/AvatarList";

import type { AuthorsValue } from "./Authors";

export function AuthorsListItem({
  value,
}: {
  value: AuthorsValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <AuthorName name={value.name} slug={value.slug} />
        <div
          className={`
            mt-[6px] font-sans text-[13px] font-normal tracking-prose
            text-nowrap text-subtle
          `}
        >
          {value.reviewCount} {value.reviewCount > 1 ? "Reviews" : "Review"}
        </div>
      </div>
    </AvatarListItem>
  );
}

function AuthorName({
  name,
  slug,
}: {
  name: AuthorsValue["name"];
  slug: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        text-base leading-normal font-semibold text-default transition-all
        duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
        hover:text-accent
      `}
      href={`/authors/${slug}/`}
    >
      <div className="leading-normal">{name}</div>
    </a>
  );
}
