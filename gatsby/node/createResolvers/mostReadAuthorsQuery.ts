import { AuthorNode } from "../createSchemaCustomization/objects/AuthorsJson";
import type { MostReadAuthorNode } from "../createSchemaCustomization/objects/MostReadAuthor";
import { ReadingNode } from "../createSchemaCustomization/objects/ReadingsJson";
import { WorkAuthorNode } from "../createSchemaCustomization/objects/WorkAuthor";
import { SchemaNames } from "../createSchemaCustomization/schemaNames";
import type {
  GatsbyNodeContext,
  GatsbyResolveInfo,
} from "../createSchemaCustomization/type-definitions";
import { resolveFieldForNode } from "../createSchemaCustomization/utils/resolveFieldForNode";

export const mostReadAuthorsQuery = {
  Query: {
    mostReadAuthors: {
      type: `[${SchemaNames.MostReadAuthor}!]!`,
      args: {
        year: "Int",
      },
      resolve: async (
        _source: unknown,
        args: {
          year: number;
        },
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const { year } = args;

        const filter = year
          ? { query: { filter: { yearFinished: { eq: year } } } }
          : {};

        const { entries: readings } =
          await context.nodeModel.findAll<ReadingNode>({
            type: SchemaNames.ReadingsJson,
            ...filter,
          });

        const authors = await Array.from(readings).reduce<
          Promise<Record<string, ReadingNode[]>>
        >(async (acc, reading) => {
          const currentValue = await acc;

          const authors = await resolveFieldForNode<WorkAuthorNode[]>(
            "authors",
            reading,
            context,
            info,
            {}
          );

          if (!authors) {
            return acc;
          }

          for (const readingAuthor of authors) {
            currentValue[readingAuthor.key] ||= [];
            currentValue[readingAuthor.key].push(reading);
          }

          return currentValue;
        }, Promise.resolve({} as Record<string, ReadingNode[]>));

        const mostReadAuthors: MostReadAuthorNode[] = [];

        for (const authorKey of Object.keys(authors)) {
          if (authors[authorKey].length < 2) {
            continue;
          }

          const author = await context.nodeModel.findOne<AuthorNode>({
            type: SchemaNames.AuthorsJson,
            query: {
              filter: {
                key: { eq: authorKey },
              },
            },
          });

          if (!author) {
            continue;
          }

          mostReadAuthors.push({
            name: author.name,
            count: authors[authorKey].length,
            slug: await resolveFieldForNode<string>(
              "slug",
              author,
              context,
              info,
              {}
            ),
            readings: authors[authorKey],
          });
        }

        return mostReadAuthors;
      },
    },
  },
};
