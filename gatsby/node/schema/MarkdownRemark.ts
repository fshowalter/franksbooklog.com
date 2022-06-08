import { Element } from "hast";
import raw from "hast-util-raw";
import toHtml from "hast-util-to-html";
import toHast from "mdast-util-to-hast";
import remark from "remark";
import { Parent } from "unist";
import visit from "unist-util-visit";
import { SchemaNames } from "./schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyNodeModel,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "./type-definitions";
import findReviewedWorkNode from "./utils/findReviewedWorkNode";
import resolveFieldForNode from "./utils/resolveFieldForNode";
import valueForGrade from "./utils/valueForGrade";

export interface MarkdownNode extends GatsbyNode {
  fileAbsolutePath: string;
  frontmatter: FrontMatter;
}

interface FrontMatter {
  sequence: number;
  slug: string;
  edition_notes: string;
  grade: string | null;
  abandoned_on: Date | null;
  edition: string;
  timeline: {
    date: Date;
    progress: number | "Finished" | "Abandoned";
  }[];
}

async function addReviewLinks(text: string, nodeModel: GatsbyNodeModel) {
  let result = text;

  const re = RegExp(/(<span data-work-slug="(.*?)">)(.*?)(<\/span>)/, "g");

  const matches = [...text.matchAll(re)];

  for (const match of matches) {
    const reviewedWork = await findReviewedWorkNode(match[2], nodeModel);

    if (!reviewedWork) {
      result = result.replace(
        `<span data-work-slug="${match[2]}">${match[3]}</span>`,
        match[3]
      );
    } else if (reviewedWork.slug) {
      result = result.replace(
        `<span data-work-slug="${match[2]}">${match[3]}</span>`,
        `<a href="/reviews/${reviewedWork.slug}/">${match[3]}</a>`
      );
    }
  }

  return result;
}

function removeFootnotes(element: Element) {
  visit(
    element,
    "element",
    function (
      element: Element,
      index: number | null,
      parent: Parent | undefined
    ) {
      if (
        parent &&
        index &&
        element.tagName === "div" &&
        element.properties &&
        element.properties.className &&
        typeof element.properties.className === "string" &&
        element.properties.className.includes("footnotes")
      ) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }

      if (
        parent &&
        index &&
        element.tagName === "sup" &&
        element.properties &&
        element.properties.id &&
        typeof element.properties.id === "string" &&
        element.properties.id.startsWith("fnref-")
      ) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }
    }
  );

  return element;
}

const MarkdownRemark = {
  name: SchemaNames.MARKDOWN_REMARK,
  interfaces: ["Node"],
  fields: {
    postType: {
      type: "String",
      resolve: (source: MarkdownNode) => {
        if (source.fileAbsolutePath.includes("/reviews/")) {
          return "REVIEW";
        }

        return null;
      },
    },
    isAudiobook: {
      type: "Boolean!",
      resolve: (source: MarkdownNode) => {
        return source.frontmatter.edition === "Audible";
      },
    },
    editionNotesHtml: {
      type: "String",
      resolve: async (
        source: MarkdownNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        if (!frontMatter) {
          return null;
        }

        const mdast = remark().parse(frontMatter.edition_notes);

        const hast = toHast(mdast, {
          allowDangerousHtml: true,
        }) as Element;

        const rawAst = raw(hast) as Element;

        if (
          rawAst &&
          rawAst.children &&
          rawAst.children[0] &&
          rawAst.children[0].tagName === "p"
        ) {
          rawAst.children[0].tagName = "span";
        }

        const html = toHtml(rawAst, {
          allowDangerousHtml: true,
        });

        return addReviewLinks(html, context.nodeModel);
      },
    },
    reviewedWork: {
      type: SchemaNames.WORKS_JSON,
      resolve: async (
        source: MarkdownNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const postType = await resolveFieldForNode<string>(
          "postType",
          source,
          context,
          info,
          args
        );

        if (postType !== "REVIEW") {
          return;
        }

        return await findReviewedWorkNode(
          source.frontmatter.slug,
          context.nodeModel
        );
      },
    },
    dateStarted: {
      type: "Date",
      extensions: {
        dateformat: {},
      },
      resolve: (source: MarkdownNode) => {
        return source.frontmatter.timeline.reduce((prev, current) =>
          prev.date < current.date ? prev : current
        ).date;
      },
    },
    yearFinished: {
      type: "Int",
      resolve: async (
        source: MarkdownNode,
        args: { key: string },
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const postType = await resolveFieldForNode<string>(
          "postType",
          source,
          context,
          info,
          args
        );

        if (postType != "REVIEW") {
          return null;
        }

        return source.frontmatter.timeline
          .reduce((prev, current) =>
            prev.date > current.date ? prev : current
          )
          .date.getFullYear();
      },
    },
    dateFinished: {
      type: "Date",
      extensions: {
        dateformat: {},
      },
      resolve: (source: MarkdownNode) => {
        return source.frontmatter.timeline.reduce((prev, current) =>
          prev.date > current.date ? prev : current
        ).date;
      },
    },
    abandoned: {
      type: "Boolean",
      resolve: (source: MarkdownNode) => {
        return (
          source.frontmatter.timeline[source.frontmatter.timeline.length - 1]
            .progress == "Abandoned"
        );
      },
    },
    readingTime: {
      type: "Int",
      extensions: {
        dateformat: {},
      },
      resolve: (source: MarkdownNode) => {
        const start = source.frontmatter.timeline[0].date;
        const end =
          source.frontmatter.timeline[source.frontmatter.timeline.length - 1]
            .date;

        if (start === end) {
          return 1;
        }

        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
      },
    },
    linkedExcerpt: {
      type: "String",
      resolve: async (
        source: MarkdownNode,
        _args: unknown,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const rawMarkdownBody = await resolveFieldForNode<string>(
          "rawMarkdownBody",
          source,
          context,
          info,
          { format: "HTML", pruneLength: 20000, truncate: false }
        );

        if (!rawMarkdownBody) {
          return null;
        }

        const hasExcerptBreak = rawMarkdownBody.includes("<!-- end -->");

        const excerptAst = await resolveFieldForNode<Element>(
          "excerptAst",
          source,
          context,
          info,
          { pruneLength: 20000, truncate: false }
        );

        if (!excerptAst) {
          return null;
        }

        removeFootnotes(excerptAst);

        let excerpt = toHtml(excerptAst, {
          allowDangerousHtml: true,
        });

        if (hasExcerptBreak) {
          excerpt = excerpt.replace(/\n+$/, "");
          excerpt = excerpt.replace(
            /<\/p>$/,
            ` <a class="globalExcerptLinkCss" href="/reviews/${source.frontmatter.slug}/">Continue reading...</a></p>`
          );
        }

        return addReviewLinks(excerpt, context.nodeModel);
      },
    },
    linkedHtml: {
      type: "String",
      resolve: async (
        source: MarkdownNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        if (!frontMatter) {
          return null;
        }

        const htmlAst = await resolveFieldForNode<Element>(
          "htmlAst",
          source,
          context,
          info,
          args
        );

        if (!htmlAst) {
          return null;
        }

        const html = toHtml(htmlAst, {
          allowDangerousHtml: true,
        });

        return addReviewLinks(html, context.nodeModel);
      },
    },
    gradeValue: {
      type: "Int",
      resolve: async (
        source: MarkdownNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        if (!frontMatter) {
          return null;
        }

        return valueForGrade(frontMatter.grade);
      },
    },
  },
};

export default MarkdownRemark;
