import type { AuthorData } from "~/content.config";

// AIDEV-NOTE: Minimal AuthorData fixtures for use in pure allAuthors() and getAuthorDetails() tests.
// reviewedWorks was removed from AuthorData in Stage 2 — review counts are now
// derived by joining the works and reviews collections at getProps time.
export const authorFixtures: AuthorData[] = [
  {
    name: "Karl Edward Wagner",
    slug: "karl-edward-wagner",
    sortName: "Wagner, Karl Edward",
  },
  {
    name: "Stephen King",
    slug: "stephen-king",
    sortName: "King, Stephen",
  },
  {
    name: "Test Author",
    slug: "test-author",
    sortName: "Author, Test",
  },
];
