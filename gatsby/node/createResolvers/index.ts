import { mostReadAuthorsQuery } from "./mostReadAuthorsQuery";
import { readingsWithReviewsQuery } from "./readingsWithReviewsQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";
import { shelfAuthorQuery } from "./shelfAuthorQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [
    readingsWithReviewsQuery,
    reviewedWorkQuery,
    mostReadAuthorsQuery,
    shelfAuthorQuery,
  ].forEach((resolver) => void createResolvers(resolver));
}
