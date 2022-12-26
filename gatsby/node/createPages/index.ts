import { CreatePagesArgs } from "gatsby";
import { createAuthorPages } from "./createAuthorPages";
import { createHomePages } from "./createHomePages";
import { createReviewPages } from "./createReviewPages";

export async function createPages(args: CreatePagesArgs) {
  await createHomePages(args);
  await createReviewPages(args);
  await createAuthorPages(args);
}
