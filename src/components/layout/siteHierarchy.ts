/**
 * Represents a navigation item with optional sub-items.
 * Used to define the site's navigation structure with support for nested menus.
 */
type SitePage = {
  /** The URL path this navigation item links to */
  href: string;
  /** Array of child navigation items for dropdown/nested menus */
  subPages: SubPage[];
  /** The display text for the navigation item */
  title: string;
};

type SubPage = Omit<SitePage, "subPages">;

/**
 * Main navigation configuration for the site.
 * Defines the primary navigation menu structure including main pages
 * and any sub-navigation items.
 */
export const siteHierarchy: SitePage[] = [
  {
    href: "/",
    subPages: [],
    title: "Home",
  },
  {
    href: "/how-i-grade/",
    subPages: [],
    title: "How I Grade",
  },
  {
    href: "/reviews/",
    subPages: [],
    title: "Reviews",
  },
  {
    href: "/authors/",
    subPages: [],
    title: "Authors",
  },
  {
    href: "/readings/",
    subPages: [
      {
        href: "/readings/stats/",
        title: "Stats",
      },
    ],
    title: "Reading Log",
  },
];
