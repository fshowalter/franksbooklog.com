import type { CreatePagesArgs } from "gatsby";
import path from "path";

interface QueryResult {
  reading: {
    years: string[];
  };
}

export async function createStatPages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;

  const queryResult = await graphql<QueryResult>(`
    {
      reading: allTimelineEntriesJson {
        years: distinct(field: { readingYear: SELECT })
      }
    }
  `);

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query for reading stats.`,
    );
    return;
  }

  queryResult.data.reading.years.forEach((year) => {
    createPage({
      path: `/stats/${year}/`,
      component: path.resolve("./src/templates/statsForYear.tsx"),
      context: {
        year: year,
      },
    });
  });
}
