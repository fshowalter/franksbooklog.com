import type { ReactNode } from "react";

export function ListItemDetails({ children }: { children: ReactNode }) {
  return (
    <div
      className={`
        flex grow flex-col items-start gap-y-2
        tablet:mt-2 tablet:w-full tablet:px-1
      `}
    >
      {children}
    </div>
  );
}
