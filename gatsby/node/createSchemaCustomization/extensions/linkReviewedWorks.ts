import {
  GatsbyFieldConfig,
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyNodeModel,
  GatsbyResolveInfo,
} from "../type-definitions";

import type { ReviewedWorksJsonNode } from "../objects/ReviewedWorksJson";
import { SchemaNames } from "../schemaNames";

interface MarkdownNode extends GatsbyNode {
  html: string;
}

export const linkReviewedWorksExtension = {
  name: `linkReviewedWorks`,
  extend(
    _options: Record<string, unknown>,
    prevFieldConfig: GatsbyFieldConfig,
  ) {
    const { resolve } = prevFieldConfig;
    return {
      resolve: async (
        source: MarkdownNode,
        args: Record<string, unknown>,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo,
      ) => {
        if (!resolve) {
          return "";
        }

        const fieldValue = (await resolve(
          source,
          args,
          context,
          info,
        )) as string;

        return await addWorkLinks(fieldValue, context.nodeModel);
      },
    };
  },
};

async function addWorkLinks(text: string, nodeModel: GatsbyNodeModel) {
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

async function findReviewedWorkNode(
  slug: string | null,
  nodeModel: GatsbyNodeModel,
) {
  if (!slug) {
    return null;
  }

  const node = await nodeModel.findOne<ReviewedWorksJsonNode>({
    type: SchemaNames.ReviewedWorksJson,
    query: {
      filter: {
        slug: {
          eq: slug,
        },
      },
    },
  });

  return node;
}
