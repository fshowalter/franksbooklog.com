import path from "path";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import findDefaultCoverNode from "../utils/findDefaultCoverNode";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { MarkdownRemarkNode } from "./MarkdownRemark";

export interface ReviewNode extends GatsbyNode {
  slug: string;
  sequence: number;
  includedInSlugs: string[];
}

export const ReviewsJson = {
  name: SchemaNames.ReviewsJson,
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
      type: `[${SchemaNames.ReviewedWorkAuthor}!]!`,
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
  source: ReviewNode,
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

async function coverResolver(
  source: ReviewNode,
  _args: GatsbyResolveArgs,
  context: GatsbyNodeContext,
) {
  const cover = await context.nodeModel.findOne({
    type: "File",
    query: {
      filter: {
        absolutePath: {
          eq: path.resolve(`./content/assets/covers/${source.slug}.png`),
        },
      },
    },
  });

  if (cover) {
    return cover;
  }

  for (let i = 0; i < source.includedInSlugs.length; i++) {
    const parentWorkCover = await context.nodeModel.findOne({
      type: "File",
      query: {
        filter: {
          absolutePath: {
            eq: path.resolve(
              `./content/assets/covers/${source.includedInSlugs[i]}.png`,
            ),
          },
        },
      },
    });

    if (parentWorkCover) {
      return parentWorkCover;
    }
  }

  return findDefaultCoverNode(context.nodeModel);
}
