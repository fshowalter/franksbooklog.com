import { mostReadAuthorsQuery } from "./mostReadAuthorsQuery";
import { reviewedAuthorQuery } from "./reviewedAuthorQuery";
import { reviewedWorkQuery } from "./reviewedWorkQuery";

import type { CreateResolversArgs } from "gatsby";

export function createResolvers({ createResolvers }: CreateResolversArgs) {
  [reviewedWorkQuery, mostReadAuthorsQuery, reviewedAuthorQuery].forEach(
    (resolver) => void createResolvers(resolver),
  );
}
