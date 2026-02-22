import type { AuthorData } from "~/content.config";

// AIDEV-NOTE: Minimal AuthorData fixtures for use in pure allAuthors() and getAuthorDetails() tests.
// reviewedWorks are { collection, id }[] references (post-parseData shape from content collection).
// "linked-work" matches the reviewedWorkFixtures slug to test reference resolution.
export const authorFixtures: AuthorData[] = [
  {
    name: "Stephen King",
    reviewedWorks: [
      { collection: "reviewedWorks", id: "linked-work" },
      { collection: "reviewedWorks", id: "orphaned-work" },
    ],
    slug: "stephen-king",
    sortName: "King, Stephen",
  },
  {
    name: "Test Author",
    reviewedWorks: [],
    slug: "test-author",
    sortName: "Author, Test",
  },
];
