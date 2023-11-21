import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { Box } from "../Box";
import { Grade } from "../Grade";
import { ListItem } from "../ListItem";
import { ListItemCover } from "../ListItemCover";
import { ListItemTitle } from "../ListItemTitle";
import { GroupedList } from "../ListWithFiltersLayout";
import { Spacer } from "../Spacer";
import { Action, ActionType } from "./Author.reducer";

export function List({
  groupedItems,
  totalCount,
  visibleCount,
  data,
  dispatch,
}: {
  groupedItems: Map<string, Queries.AuthorListItemFragment[]>;
  totalCount: number;
  visibleCount: number;
  data: Queries.AuthorListFragment;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <GroupedList
      data-testid="cover-list"
      groupedItems={groupedItems}
      visibleCount={visibleCount}
      totalCount={totalCount}
      onShowMore={() => dispatch({ type: ActionType.SHOW_MORE })}
    >
      {(item) => (
        <WorkListItem item={item} key={item.slug} pageAuthorSlug={data.slug} />
      )}
    </GroupedList>
  );
}

function WorkListItem({
  item,
  pageAuthorSlug,
}: {
  pageAuthorSlug: string;
  item: Queries.AuthorListItemFragment;
}): JSX.Element {
  return (
    <ListItem alignItems="center">
      <ListItemCover
        slug={item.review ? item.slug : null}
        image={item.cover}
        title={item.title}
        flexShrink={0}
      />
      <Box
        flexGrow={1}
        width={{ tablet: "full" }}
        paddingRight={{ default: "gutter", desktop: 16 }}
      >
        <Box>
          <ListItemTitle
            title={item.title}
            slug={item.review ? item.slug : null}
          />
          <Authors authors={item.authors} pageAuthorSlug={pageAuthorSlug} />
          <Spacer axis="vertical" size={8} />
          <YearAndKind year={item.yearPublished} kind={item.kind} />
          <Spacer axis="vertical" size={8} />
          <Grade grade={item.grade} height={16} />
          <Spacer axis="vertical" size={8} />
        </Box>
      </Box>
    </ListItem>
  );
}

function Authors({
  pageAuthorSlug,
  authors,
}: {
  pageAuthorSlug: string;
  authors: readonly Queries.AuthorListItemAuthorsFragment[];
}) {
  if (authors.length === 1) {
    return null;
  }

  const otherAuthors = authors.filter((author) => {
    return author.slug !== pageAuthorSlug;
  });

  return (
    <>
      <Spacer axis="vertical" size={4} />
      <Box color="muted" fontSize="default" lineHeight={20}>
        (with {toSentenceArray(otherAuthors.map((author) => author.name))})
      </Box>
    </>
  );
}

function YearAndKind({
  kind,
  year,
}: {
  kind: string;
  year: number;
}): JSX.Element | null {
  return (
    <Box color="subtle" fontSize="small" letterSpacing={0.5} lineHeight={16}>
      <Box as="span">{kind} | </Box>
      {year}
    </Box>
  );
}

export const pageQuery = graphql`
  fragment AuthorList on AuthorsJson {
    slug
    works {
      ...AuthorListItem
    }
  }

  fragment AuthorListItemAuthors on WorkAuthor {
    slug
    name
  }

  fragment AuthorListItem on AuthorWork {
    id
    title
    yearPublished
    kind
    slug
    sortTitle
    grade
    gradeValue
    authors {
      ...AuthorListItemAuthors
    }
    reviewed
    cover {
      ...ListItemCover
    }
  }
`;
