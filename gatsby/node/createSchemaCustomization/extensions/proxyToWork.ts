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
        info: GatsbyResolveInfo,
      ) => {
        // console.log(source.internal.type);
        // if (source.internal.type === SchemaNames.WorksJson) {
        //   return await resolveFieldForNode({
        //     fieldName,
        //     source,
        //     context,
        //     info,
        //     args,
        //   });
        // }

        const workNode = await resolveFieldForNode<WorkNode>({
          fieldName: "work",
          source,
          context,
          info,
        });

        if (!workNode) {
          return null;
        }

        return await resolveFieldForNode({
          fieldName,
          source: workNode,
          context,
          info,
          args,
        });
      },
    };
  },
};
