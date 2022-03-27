import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeModel } from "../type-definitions";
import type { WorkNode } from "../WorksJson";

export default async function findReviewedWorkNode(
  slug: string | null,
  nodeModel: GatsbyNodeModel
) {
  if (!slug) {
    return null;
  }

  const node = await nodeModel.findOne<WorkNode>({
    type: SchemaNames.WORKS_JSON,
    query: {
      filter: {
        slug: {
          eq: slug,
        },
        reviewed: {
          eq: true,
        },
      },
    },
  });

  return node;
}
