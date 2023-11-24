import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { Box } from "../Box";
import { Grade } from "../Grade";
import { ListItem } from "../ListItem";
import { ListItemCover } from "../ListItemCover";
import { ListItemTitle } from "../ListItemTitle";
import { GroupedList } from "../ListWithFiltersLayout";
import { Spacer } from "../Spacer";
import { Action, ActionType } from "./Reviews.reducer";

export function List({
  groupedItems,
  totalCount,
  visibleCount,
  dispatch,
}: {
  groupedItems: Map<string, Queries.ReviewsListItemFragment[]>;
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
      {(item) => <ReviewsListItem item={item} key={item.slug} />}
    </GroupedList>
  );
}

function ReviewsListItem({
  item,
}: {
  item: Queries.ReviewsListItemFragment;
}): JSX.Element {
  return (
    <ListItem alignItems="center">
      <ListItemCover
        slug={item.slug}
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
          <ListItemTitle title={item.title} slug={item.slug} />
          <Spacer axis="vertical" size={4} />
          <Authors authors={item.authors} />
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
  authors,
}: {
  authors: readonly Queries.ReviewsListItemAuthorFragment[];
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
  year: string;
}): JSX.Element | null {
  return (
    <Box color="subtle" fontSize="small" letterSpacing={0.5} lineHeight={16}>
      <Box as="span">{kind} | </Box>
      {year}
    </Box>
  );
}

export const query = graphql`
  fragment ReviewsListItemAuthor on ReviewedWorksJsonWorkAuthor {
    name
    notes
    sortName
  }

  fragment ReviewsListItem on ReviewedWorksJson {
    id
    grade
    slug
    date(formatString: "MMM D, YYYY")
    gradeValue
    sortDate: date
    title
    yearPublished
    monthReviewed: date(formatString: "MMMM")
    yearReviewed
    sortTitle
    kind
    authors {
      ...ReviewsListItemAuthor
    }
    cover {
      ...ListItemCover
    }
  }
`;
