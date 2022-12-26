import {
  GatsbyFieldConfig,
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveInfo,
} from "../type-definitions";
import { addWorkLinks } from "../utils/addWorkLinks";

interface MarkdownNode extends GatsbyNode {
  html: string;
}

export const linkReviewedWorksExtension = {
  name: `linkReviewedWorks`,
  extend(
    _options: Record<string, unknown>,
    prevFieldConfig: GatsbyFieldConfig
  ) {
    const { resolve } = prevFieldConfig;
    return {
      resolve: async (
        source: MarkdownNode,
        args: Record<string, unknown>,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        if (!resolve) {
          return "";
        }

        const fieldValue = (await resolve(
          source,
          args,
          context,
          info
        )) as string;

        return await addWorkLinks(fieldValue, context.nodeModel);
      },
    };
  },
};
