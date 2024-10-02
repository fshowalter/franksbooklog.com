export function ListItem({
  children,
  background = "bg-default",
  itemsCenter = false,
  extraVerticalPadding = false,
}: {
  children: React.ReactNode;
  background?: string;
  itemsCenter?: boolean;
  extraVerticalPadding?: boolean;
}) {
  return (
    <li
      className={`${background} ${itemsCenter ? "items-center" : ""} ${extraVerticalPadding ? "tablet:py-6" : ""}relative mb-1 flex max-w-screen-max flex-row gap-x-4 px-container py-4 last-of-type:mb-0 tablet:gap-x-6 tablet:px-4 desktop:px-6`}
    >
      {children}
    </li>
  );
}
