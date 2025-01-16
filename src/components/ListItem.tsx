export function ListItem({
  background = "bg-default",
  children,
  className,
  extraVerticalPadding = false,
  itemsCenter = false,
}: {
  background?: string;
  children: React.ReactNode;
  className?: string;
  extraVerticalPadding?: boolean;
  itemsCenter?: boolean;
}) {
  return (
    <li
      className={`${background} ${itemsCenter ? "items-center" : ""} ${extraVerticalPadding ? "tablet:py-6" : ""} relative mb-1 flex max-w-screen-max flex-row gap-x-4 px-container py-4 last-of-type:mb-0 tablet:gap-x-6 tablet:px-4 desktop:px-6 ${className || ""}`}
    >
      {children}
    </li>
  );
}
