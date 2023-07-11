import { GatsbyNodeModel } from "../type-definitions";
import { findReviewedWorkNode } from "./findReviewedWorkNode";

export async function addWorkLinks(text: string, nodeModel: GatsbyNodeModel) {
  let result = text;

  const re = RegExp(/(<span data-work-slug="(.*?)">)(.*?)(<\/span>)/, "g");

  const matches = [...text.matchAll(re)];

  for (const match of matches) {
    const reviewedWork = await findReviewedWorkNode(match[2], nodeModel);

    if (!reviewedWork) {
      result = result.replace(
        `<span data-work-slug="${match[2]}">${match[3]}</span>`,
        match[3],
      );
    } else {
      result = result.replace(
        `<span data-work-slug="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${reviewedWork.slug}/">${match[3]}</a>`,
      );
    }
  }

  return result;
}
