import { WorkNode } from "../objects/WorksJson";
import {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";

export const proxyToWorkExtension = {
  name: `proxyToWork`,
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
        const workNode = await resolveFieldForNode<WorkNode>(
          "work",
          source,
          context,
          info,
          {}
        );

        if (!workNode) {
          return null;
        }

        return await resolveFieldForNode(
          fieldName,
          workNode,
          context,
          info,
          args
        );
      },
    };
  },
};
