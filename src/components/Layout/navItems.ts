export type NavItem = {
  text: string;
  target: string;
  subItems: NavItem[];
};

export const navItems: NavItem[] = [
  {
    text: "Home",
    target: "/",
    subItems: [],
  },
  {
    text: "How I Grade",
    target: "/how-i-grade/",
    subItems: [],
  },
  {
    text: "Reviews",
    target: "/reviews/",
    subItems: [],
  },
  {
    text: "Reading Log",
    target: "/readings/",
    subItems: [
      {
        text: "Stats",
        target: "/readings/stats/",
        subItems: [],
      },
    ],
  },
  {
    text: "Authors",
    target: "/authors/",
    subItems: [],
  },
  {
    text: "Shelf",
    target: "/shelf/",
    subItems: [],
  },
];
