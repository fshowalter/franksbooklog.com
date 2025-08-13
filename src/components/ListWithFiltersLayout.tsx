import type { ReactNode } from "react";

import { Layout } from "./Layout";

type Props = {
  backdrop: ReactNode;
  children: ReactNode;
  className?: string;
  hasBackdrop?: boolean;
  subNav?: ReactNode;
};

/**
 * Server-side layout wrapper for list pages with filters.
 * This component should NOT be hydrated - it renders the static layout parts.
 * The children (ListWithFilters) will be hydrated separately.
 */
export function ListWithFiltersLayout({
  backdrop,
  children,
  className,
  hasBackdrop = true,
  subNav,
}: Props) {
  return (
    <Layout
      className={`
        bg-subtle
        ${className || ""}
      `}
      hasBackdrop={hasBackdrop}
    >
      {backdrop}
      {subNav && subNav}
      {children}
    </Layout>
  );
}
