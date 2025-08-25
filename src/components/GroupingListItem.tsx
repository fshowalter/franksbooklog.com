import type { ReactNode } from "react";

export function GroupingListItem({
  children,
  className,
  groupText,
}: {
  children: ReactNode;
  className?: string;
  groupText: string;
}) {
  return (
    <li
      className={`
        block
        first-of-type:mt-4
        ${className ?? ""}
      `}
      id={groupText}
    >
      <div className={`pt-0 text-md`}>
        <div
          className={`
            max-w-(--breakpoint-desktop) bg-subtle px-container py-4 text-xl
            leading-8
            tablet:px-1
          `}
        >
          {groupText}
        </div>
      </div>
      <div className="bg-subtle">{children}</div>
    </li>
  );
}
