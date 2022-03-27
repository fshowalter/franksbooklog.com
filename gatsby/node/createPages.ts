import type { GatsbyNode } from "gatsby";
import createAuthorPages from "./pages/createAuthorPages";
import createHomePages from "./pages/createHomePages";
import createReviewPages from "./pages/createReviewPages";
// import createStatPages from "./pages/createStatPages";
import createShelfPages from "./pages/createShelfPages";

const createPages: GatsbyNode["createPages"] = async (createPagesArgs) => {
  await createHomePages(createPagesArgs);
  await createReviewPages(createPagesArgs);
  await createAuthorPages(createPagesArgs);
  createShelfPages(createPagesArgs);
  // await createStatPages(createPagesArgs);
};

export default createPages;
