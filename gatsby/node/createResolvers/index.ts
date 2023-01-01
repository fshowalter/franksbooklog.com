import { mostReadAuthorsQuery } from "./mostReadAuthorsQuery";
import { readingsWithReviewsQuery } from "./readingsWithReviewsQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [readingsWithReviewsQuery, reviewedWorkQuery, mostReadAuthorsQuery].forEach(
    (resolver) => void createResolvers(resolver)
  );
}
