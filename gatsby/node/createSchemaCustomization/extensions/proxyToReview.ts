import { MarkdownRemarkNode } from "../objects/MarkdownRemark";
import {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";

export const proxyToReviewExtension = {
  name: `proxyToReview`,
  args: {
    fieldName: `String!`,
  },
  extend({ fieldName }: { fieldName: string }) {
    return {
      resolve: async (
        source: GatsbyNode,
        args: Record<string, unknown>,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const review = await resolveFieldForNode<MarkdownRemarkNode>({
          fieldName: "review",
          source,
          context,
          info,
        });

        if (!review) {
          return null;
        }

        return await resolveFieldForNode({
          fieldName,
          source: review,
          context,
          info,
          args,
        });
      },
    };
  },
};
