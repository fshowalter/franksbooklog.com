type SitePage = {
  href: string;
  subPages: SubPage[];
  title: string;
};

type SubPage = Omit<SitePage, "subPages">;

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
