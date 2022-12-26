import { readingsWithReviewsQuery } from "./readingsWithReviewsQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [readingsWithReviewsQuery, reviewedWorkQuery].forEach(
    (resolver) => void createResolvers(resolver)
  );
}
