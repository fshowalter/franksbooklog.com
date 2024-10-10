export type NavItem = {
  subItems: NavItem[];
  target: string;
  text: string;
};

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
  {
    subItems: [],
    target: "/authors/",
    text: "Authors",
  },
  {
    subItems: [],
    target: "/shelf/",
    text: "Shelf",
  },
];
