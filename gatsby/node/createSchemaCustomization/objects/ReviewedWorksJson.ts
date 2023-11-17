import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { MarkdownRemarkNode } from "./MarkdownRemark";
import { coverResolver } from "./fieldResolvers/coverResolver";

interface ReviewedWorkNode extends GatsbyNode {
  slug: string;
  sequence: number;
  includedInSlugs: string[];
}

export const ReviewedWorksJson = {
  name: SchemaNames.ReviewedWorksJson,
  interfaces: ["Node"],
  fields: {
    sequence: "Int!",
    title: "String!",
    sortTitle: "String!",
    slug: "String!",
    includedInSlugs: "[String!]!",
    edition: "String!",
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    excerpt: {
      type: "String",
      resolve: excerptResolver,
    },
    yearPublished: "Int!",
    yearReviewed: `Int!`,
    kind: "String!",
    authors: {
      type: `[${SchemaNames.WorkAuthor}!]!`,
    },
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
    grade: "String",
    gradeValue: `Int!`,
  },
  extensions: {
    infer: false,
  },
};

async function excerptResolver(
  source: ReviewedWorkNode,
  args: GatsbyResolveArgs,
  context: GatsbyNodeContext,
  info: GatsbyResolveInfo,
) {
  const reviewFileNode = await context.nodeModel.findOne<GatsbyNode>({
    type: "File",
    query: {
      filter: {
        sourceInstanceName: {
          eq: "reviews",
        },
        childMarkdownRemark: {
          frontmatter: {
            work_slug: {
              eq: source.slug,
            },
          },
        },
      },
    },
  });

  if (!reviewFileNode) {
    return null;
  }

  const reviewMarkdownNode = await resolveFieldForNode<MarkdownRemarkNode>({
    fieldName: "childMarkdownRemark",
    source: reviewFileNode,
    context,
    info,
  });

  if (!reviewMarkdownNode) {
    return null;
  }

  return await resolveFieldForNode<string>({
    fieldName: "excerptHtml",
    source: reviewMarkdownNode,
    context,
    info,
    args,
  });
}
