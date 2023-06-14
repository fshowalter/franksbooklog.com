import { graphql } from "gatsby";
import { backgroundColors } from "../../styles/colors.css";
import { Box } from "../Box";
import { GraphqlImage } from "../GraphqlImage";
import { Link } from "../Link";
import { ListItem } from "../ListItem";
import { GroupedList } from "../ListWithFiltersLayout";
import { Spacer } from "../Spacer";
import { Action, ActionType } from "./Authors.reducer";

export function List({
  groupedItems,
  totalCount,
  visibleCount,
  dispatch,
}: {
  groupedItems: Map<string, Queries.AuthorsListItemFragment[]>;
  totalCount: number;
  visibleCount: number;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <GroupedList
      data-testid="author-list"
      groupedItems={groupedItems}
      visibleCount={visibleCount}
      totalCount={totalCount}
      onShowMore={() => dispatch({ type: ActionType.SHOW_MORE })}
    >
      {(item) => <AuthorListItem item={item} key={item.slug} />}
    </GroupedList>
  );
}

function AuthorListItem({
  item,
}: {
  item: Queries.AuthorsListItemFragment;
}): JSX.Element {
  return (
    <ListItem alignItems="center">
      <Avatar author={item} />
      <AuthorName author={item} />
      <Box marginLeft="auto">
        {item.reviewedWorkCount}&thinsp;/&thinsp;{item.workCount}
      </Box>
    </ListItem>
  );
}

function Avatar({ author }: { author: Queries.AuthorsListItemFragment }) {
  if (author.avatar && author.slug) {
    return (
      <Link
        to={`/shelf/authors/${author.slug}/`}
        maxWidth={48}
        transform="safariBorderRadiusFix"
        overflow="hidden"
        boxShadow="borderAll"
        borderRadius="half"
      >
        <GraphqlImage
          image={author.avatar}
          alt={`An image of ${author.name}`}
        />
      </Link>
    );
  }

  return (
    <Box maxWidth={48}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill={backgroundColors.canvas}
        width="100%"
      >
        <path
          clipRule="evenodd"
          d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z"
          fillRule="evenodd"
        />
      </svg>
    </Box>
  );
}

function AuthorName({ author }: { author: Queries.AuthorsListItemFragment }) {
  return (
    <Link
      to={`/reviews/authors/${author.slug}/`}
      fontSize="medium"
      textAlign="center"
    >
      <Spacer axis="vertical" size={4} />
      <Box lineHeight="default">{author.name}</Box>
      <Spacer axis="vertical" size={4} />
    </Link>
  );
}

export const pageQuery = graphql`
  fragment AuthorsListItem on AuthorsJson {
    name
    slug
    sortName
    reviewedWorkCount
    workCount
    avatar {
      childImageSharp {
        gatsbyImageData(
          layout: FIXED
          formats: [JPG, AVIF]
          quality: 80
          width: 48
          height: 48
          placeholder: BLURRED
        )
      }
    }
  }
`;
