import type { WorkNode } from "../objects/WorksJson";
import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeModel } from "../type-definitions";

export async function findReviewedWorkNode(
  slug: string | null,
  nodeModel: GatsbyNodeModel,
) {
  if (!slug) {
    return null;
  }

  const node = await nodeModel.findOne<WorkNode>({
    type: SchemaNames.ReviewedWorksJson,
    query: {
      filter: {
        workSlug: {
          eq: slug,
        },
      },
    },
  });

  return node;
}
