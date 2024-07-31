import { ccn } from "src/utils/concatClassNames";

export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <h1
      data-pagefind-meta="title"
      className={ccn(
        "text-[2rem] font-normal leading-none desktop:text-[2.25rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
