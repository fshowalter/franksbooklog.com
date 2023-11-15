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

export interface UpdateNode extends GatsbyNode {
  workSlug: string;
  sequence: number;
  includedInWorkSlugs: string[];
}

export const UpdatesJson = {
  name: SchemaNames.UpdatesJson,
  interfaces: ["Node"],
  fields: {
    sequence: "Int!",
    workSlug: "String!",
    includedInWorkSlugs: "[String!]!",
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
    title: "String!",
    yearPublished: "Int!",
    kind: "String!",
    authors: {
      type: `[${SchemaNames.UpdateAuthor}!]!`,
    },
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
    grade: "String",
  },
  extensions: {
    infer: false,
  },
};

async function excerptResolver(
  source: UpdateNode,
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
  source: UpdateNode,
  _args: GatsbyResolveArgs,
  context: GatsbyNodeContext,
) {
  const cover = await context.nodeModel.findOne({
    type: "File",
    query: {
      filter: {
        absolutePath: {
          eq: path.resolve(`./content/assets/covers/${source.workSlug}.png`),
        },
      },
    },
  });

  if (cover) {
    return cover;
  }

  let parentWorkCover;

  source.includedInWorkSlugs.find(async (slug) => {
    parentWorkCover = await context.nodeModel.findOne({
      type: "File",
      query: {
        filter: {
          absolutePath: {
            eq: path.resolve(`./content/assets/covers/${slug}.png`),
          },
        },
      },
    });

    return parentWorkCover;
  });

  return parentWorkCover || findDefaultCoverNode(context.nodeModel);
}
