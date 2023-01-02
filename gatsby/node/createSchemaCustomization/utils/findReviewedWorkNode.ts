import type { WorkNode } from "../objects/WorksJson";
import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeModel } from "../type-definitions";

export async function findReviewedWorkNode(
  slug: string | null,
  nodeModel: GatsbyNodeModel
) {
  if (!slug) {
    return null;
  }

  const node = await nodeModel.findOne<WorkNode>({
    type: SchemaNames.WorksJson,
    query: {
      filter: {
        slug: {
          eq: slug,
        },
        review: {
          id: { ne: null },
        },
      },
    },
  });

  return node;
}
