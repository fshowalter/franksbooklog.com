import { readingStatsQuery } from "./readingStatsQuery";
import { reviewedAuthorQuery } from "./reviewedAuthorQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [reviewedWorkQuery, reviewedAuthorQuery, readingStatsQuery].forEach(
    (resolver) => void createResolvers(resolver),
  );
}
