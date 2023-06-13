import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { Box } from "../Box";
import { ListItem } from "../ListItem";
import { ListItemCover } from "../ListItemCover";
import { ListItemTitle } from "../ListItemTitle";
import { GroupedList } from "../ListWithFiltersLayout";
import { Spacer } from "../Spacer";
import { Action, ActionType } from "./Shelf.reducer";

export function List({
  groupedItems,
  totalCount,
  visibleCount,
  dispatch,
}: {
  groupedItems: Map<string, Queries.ShelfListItemFragment[]>;
  totalCount: number;
  visibleCount: number;
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
      {(item) => <ShelfListItem item={item} key={item.slug} />}
    </GroupedList>
  );
}

function ShelfListItem({
  item,
}: {
  item: Queries.ShelfListItemFragment;
}): JSX.Element {
  return (
    <ListItem alignItems="center">
      <ListItemCover
        slug={undefined}
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
          <ListItemTitle title={item.title} slug={undefined} />
          <Spacer axis="vertical" size={4} />
          <Authors authors={item.authors} />
          <Spacer axis="vertical" size={8} />
          <YearAndKind year={item.yearPublished} kind={item.kind} />
          <Spacer axis="vertical" size={8} />
        </Box>
      </Box>
    </ListItem>
  );
}

function Authors({
  authors,
}: {
  authors: readonly Queries.ShelfListItemAuthorFragment[];
}) {
  return (
    <Box color="muted" fontSize="default" lineHeight={20}>
      {toSentenceArray(authors.map((author) => author.name))}
    </Box>
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

export const query = graphql`
  fragment ShelfListItemAuthor on WorkAuthor {
    name
    notes
    sortName
  }

  fragment ShelfListItem on WorksJson {
    id
    slug
    title
    yearPublished
    sortTitle
    kind
    authors {
      ...ShelfListItemAuthor
    }
    cover {
      ...ListItemCover
    }
  }
`;
