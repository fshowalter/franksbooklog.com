/**
 * Represents a navigation item with optional sub-items.
 * Used to define the site's navigation structure with support for nested menus.
 */
export type NavItem = {
  /** Array of child navigation items for dropdown/nested menus */
  subItems: NavItem[];
  /** The URL path this navigation item links to */
  target: string;
  /** The display text for the navigation item */
  text: string;
};

/**
 * Main navigation configuration for the site.
 * Defines the primary navigation menu structure including main pages
 * and any sub-navigation items.
 */
export const navItems: NavItem[] = [
  {
    subItems: [],
    target: "/",
    text: "Home",
  },
  {
    subItems: [],
    target: "/how-i-grade/",
    text: "How I Grade",
  },
  {
    subItems: [],
    target: "/reviews/",
    text: "Reviews",
  },
  {
    subItems: [],
    target: "/authors/",
    text: "Authors",
  },
  {
    subItems: [
      {
        subItems: [],
        target: "/readings/stats/",
        text: "Stats",
      },
    ],
    target: "/readings/",
    text: "Reading Log",
  },
];
