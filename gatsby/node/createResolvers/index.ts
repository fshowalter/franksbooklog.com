import { mostReadAuthorsQuery } from "./mostReadAuthorsQuery";
import { readingsWithReviewsQuery } from "./readingsWithReviewsQuery";
import { reviewedAuthorQuery } from "./reviewedAuthorQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [
    readingsWithReviewsQuery,
    reviewedWorkQuery,
    mostReadAuthorsQuery,
    reviewedAuthorQuery,
  ].forEach((resolver) => void createResolvers(resolver));
}
