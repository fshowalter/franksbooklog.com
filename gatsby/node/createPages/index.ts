import { CreatePagesArgs } from "gatsby";
import { createAuthorPages } from "./createAuthorPages";
import { createHomePages } from "./createHomePages";
import { createReviewPages } from "./createReviewPages";
import { createStatPages } from "./createStatPages";

export async function createPages(args: CreatePagesArgs) {
  await createHomePages(args);
  await createReviewPages(args);
  await createAuthorPages(args);
  await createStatPages(args);
}
