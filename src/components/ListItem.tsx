import { ccn } from "src/utils/concactClassnames";

export function ListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
      className={ccn(
        "flex flex-row items-center gap-x-4 px-gutter py-4 even:bg-subtle tablet:gap-x-6 tablet:px-6",
        className,
      )}
    >
      {children}
    </li>
  );
}
