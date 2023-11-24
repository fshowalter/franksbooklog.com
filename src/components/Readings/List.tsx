import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { BarGradient } from "../BarGradient";
import { Box } from "../Box";
import { Link } from "../Link";
import { ListItem } from "../ListItem";
import { ListItemCover } from "../ListItemCover";
import { GroupedList } from "../ListWithFiltersLayout";
import { Spacer } from "../Spacer";
import { subListItemBoxShadowStyle } from "./List.css";
import { Action, ActionType } from "./Readings.reducer";

export function List({
  groupedItems,
  visibleCount,
  totalCount,
  dispatch,
}: {
  groupedItems: Map<string, Map<string, Queries.ReadingsListItemFragment[]>>;
  visibleCount: number;
  totalCount: number;
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
      {(dateGroup) => {
        const [dayAndDate, items] = dateGroup;
        return (
          <DateListItem
            items={items}
            key={dayAndDate}
            dayAndDate={dayAndDate}
          />
        );
      }}
    </GroupedList>
  );
}

function DateListItem({
  dayAndDate,
  items,
}: {
  dayAndDate: string;
  items: Queries.ReadingsListItemFragment[];
}): JSX.Element {
  const [day, date] = dayAndDate.split("-");

  return (
    <ListItem paddingBottom={0} alignItems="center">
      <Box>
        <Box boxShadow="borderAll" borderRadius={4}>
          <Box
            backgroundColor="canvas"
            textAlign="center"
            width={48}
            paddingY={8}
            textTransform="uppercase"
            fontSize="small"
          >
            {day}
          </Box>
          <Box textAlign="center" fontSize="large">
            {date}
          </Box>
        </Box>
        <Spacer axis="vertical" size={16} />
      </Box>
      <Box
        as="ul"
        display="flex"
        flexDirection="column"
        rowGap={16}
        flexGrow={1}
      >
        {items.map((item) => {
          return <SubListItem item={item} key={item.sequence} />;
        })}
      </Box>
    </ListItem>
  );
}

export function SubListItem({
  item,
}: {
  item: Queries.ReadingsListItemFragment;
}): JSX.Element {
  const progressValue = parseProgress(item.progress);

  return (
    <ListItem
      alignItems="center"
      boxShadow="borderBottom"
      paddingTop={0}
      className={subListItemBoxShadowStyle}
      backgroundColor="unset"
    >
      <ListItemCover
        slug={item.reviewed ? item.slug : undefined}
        image={item.cover}
        title={item.title}
        flexShrink={0}
        boxShadow="borderAll"
      />
      <Box flexGrow={1}>
        <Title item={item} />
        <Spacer axis="vertical" size={4} />
        <Authors authors={item.authors} />
        <Spacer axis="vertical" size={8} />
        <YearAndKind year={item.yearPublished} kind={item.kind} />
        <Spacer axis="vertical" size={8} />
        {item.progress !== "Abandoned" && (
          <BarGradient
            value={progressValue}
            maxValue={100}
            __lineHeight="1rem"
          />
        )}
        <Spacer axis="vertical" size={8} />
        <Edition edition={item.edition} />
      </Box>
    </ListItem>
  );
}

function parseProgress(progress: string) {
  const progressNumber = progress.split("%", 1)[0];

  if (progressNumber === "Finished") {
    return 100;
  }

  if (!isNaN(Number(progressNumber))) {
    return parseInt(progressNumber);
  }

  return 100;
}

export function Title({ item }: { item: Queries.ReadingsListItemFragment }) {
  const progressBox = (
    <Box as="span" fontSize="xSmall" color="subtle" fontWeight="light">
      {item.progress}
    </Box>
  );

  if (item.reviewed) {
    return (
      <Link
        to={`/reviews/${item.slug}/`}
        fontSize="medium"
        lineHeight={20}
        display="block"
      >
        {item.title}&#8239;&#8239;{progressBox}
      </Link>
    );
  }

  return (
    <Box as="span" fontSize="medium" display="block" lineHeight={20}>
      {item.title}&#8239;&#8239;{progressBox}
    </Box>
  );
}

function Authors({
  authors,
}: {
  authors: readonly Queries.ReadingListItemAuthorFragment[];
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
}): JSX.Element {
  return (
    <Box color="subtle" fontSize="small" letterSpacing={0.5} lineHeight={16}>
      <Box as="span">{kind} | </Box>
      {year}
    </Box>
  );
}

function Edition({ edition }: { edition: string }): JSX.Element {
  return (
    <Box color="subtle" fontSize="small" letterSpacing={0.5} lineHeight={16}>
      {edition}
    </Box>
  );
}

export const query = graphql`
  fragment ReadingListItemAuthor on TimelineEntriesJsonAuthor {
    name
  }

  fragment ReadingsListItem on TimelineEntriesJson {
    slug
    reviewed
    sequence
    readingYear
    readingMonth: date(formatString: "MMM")
    readingDay: date(formatString: "ddd")
    date(formatString: "D")
    yearPublished
    progress
    title
    edition
    kind
    authors {
      ...ReadingListItemAuthor
    }
    cover {
      ...ListItemCover
    }
  }
`;
