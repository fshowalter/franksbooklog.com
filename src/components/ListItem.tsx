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
      className={`
        group/list-item transform-gpu transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-[102.5%] has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
        ${background}
        ${itemsCenter ? "items-center" : ""}
        ${extraVerticalPadding ? `tablet:py-6` : ""}
        relative mb-1 flex max-w-(--breakpoint-laptop) flex-row gap-x-4
        px-container py-4
        last-of-type:mb-0
        tablet:gap-x-6 tablet:px-6
        ${className || ""}
      `}
    >
      {children}
    </li>
  );
}
