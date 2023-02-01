import { graphql } from "gatsby";
import { useReducer } from "react";
import { backgroundColors } from "../../styles/colors.css";
import { Box } from "../Box";
import { DebouncedInput } from "../DebouncedInput";
import { Fieldset } from "../Fieldset";
import { GraphqlImage } from "../GraphqlImage";
import { Layout } from "../Layout";
import { Link } from "../Link";
import { PageTitle } from "../PageTitle";
import { SelectField } from "../SelectField";
import { Spacer } from "../Spacer";
import {
  avatarMaxWidthStyle,
  stickyHeaderStyle,
  stickyListInfoStyle,
} from "./AuthorAvatarListWithFilters.css";
import {
  ActionType,
  initState,
  reducer,
  Sort,
} from "./AuthorAvatarListWithFilters.reducer";

function ListInfo({
  visible,
  total,
}: {
  visible: number;
  total: number;
}): JSX.Element {
  let showingText;

  if (visible > total) {
    showingText = `Showing ${total} of ${total}`;
  } else {
    showingText = `Showing ${visible} of ${total.toLocaleString()}`;
  }

  return <Box>{showingText}</Box>;
}

function groupForItem(
  item: Queries.AuthorAvatarListItemFragment,
  sortValue: Sort
): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      const letter = item.sortName.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.sortName.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

function groupItems({
  items,
  sortValue,
}: {
  items: Queries.AuthorAvatarListItemFragment[];
  sortValue: Sort;
}): Map<string, Queries.AuthorAvatarListItemFragment[]> {
  const groupedItems = new Map<
    string,
    Queries.AuthorAvatarListItemFragment[]
  >();

  items.map((item) => {
    const group = groupForItem(item, sortValue);
    let groupValue = groupedItems.get(group);

    if (!groupValue) {
      groupValue = [];
      groupedItems.set(group, groupValue);
    }
    groupValue.push(item);
  });

  return groupedItems;
}

function Avatar({ author }: { author: Queries.AuthorAvatarListItemFragment }) {
  if (author.avatar && author.slug) {
    return (
      <Link
        to={`/shelf/authors/${author.slug}/`}
        className={avatarMaxWidthStyle}
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
    <Box className={avatarMaxWidthStyle}>
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

function AuthorName({
  author,
}: {
  author: Queries.AuthorAvatarListItemFragment;
}) {
  if (author.slug) {
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

  return (
    <Box color="subtle" fontSize="medium" textAlign="center">
      <Spacer axis="vertical" size={4} />
      <Box lineHeight="default">{author.name}</Box>
      <Spacer axis="vertical" size={4} />
    </Box>
  );
}

function ListItem({
  author,
}: {
  author: Queries.AuthorAvatarListItemFragment;
}): JSX.Element {
  return (
    <Box
      as="li"
      display="flex"
      flexDirection="row"
      columnGap={32}
      backgroundColor="zebraOdd"
      paddingX="gutter"
      paddingY={16}
      alignItems={{ default: "center" }}
    >
      <Avatar author={author} />
      <AuthorName author={author} />
      <Box marginLeft="auto">
        {author.reviewedWorkCount}&thinsp;/&thinsp;{author.workCount}
      </Box>
    </Box>
  );
}

export function AuthorAvatarListWithFilters({
  authors,
}: {
  authors: readonly Queries.AuthorAvatarListItemFragment[];
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      authors,
    },
    initState
  );

  const groupedItems = groupItems({
    items: state.filteredAuthors,
    sortValue: state.sortValue,
  });

  return (
    <Layout>
      <Box
        as="main"
        display="flex"
        flexDirection={{ default: "column", desktop: "row" }}
        paddingX={{ default: 0, desktop: "pageMargin" }}
        columnGap={64}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingX={{ default: "pageMargin", desktop: 0 }}
          paddingTop={32}
          flexBasis={352}
        >
          <Box maxWidth="prose">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Link to="/shelf/">Shelf</Link>
              <PageTitle textAlign="center">
                Authors
                <Spacer axis="vertical" size={8} />
              </PageTitle>
              <Box color="subtle">
                <Box as="q" display="block" textAlign="center" color="subtle">
                  There is nothing to writing. All you do is sit down at a
                  typewriter and bleed.
                </Box>
              </Box>
            </Box>
          </Box>
          <Spacer axis="vertical" size={32} />
          <Box>
            <Fieldset legend="Filter & Sort">
              <DebouncedInput
                label="Name"
                placeholder="Enter all or part of a name"
                onInputChange={(value) =>
                  dispatch({ type: ActionType.FILTER_NAME, value })
                }
              />
              <SelectField
                value={state.sortValue}
                label="Order By"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.SORT,
                    value: e.target.value as Sort,
                  })
                }
              >
                <option value="name-asc">Name (A &rarr; Z)</option>
                <option value="name-desc">Name (Z &larr; A)</option>
              </SelectField>
            </Fieldset>
            <Spacer axis="vertical" size={32} />
          </Box>
        </Box>
        <Box name="list" display="flex" flexDirection="column" flexGrow={1}>
          <Spacer axis="vertical" size={{ default: 0, desktop: 32 }} />
          <Box
            color="subtle"
            paddingX="gutter"
            textAlign="center"
            backgroundColor="default"
            lineHeight={36}
            className={stickyListInfoStyle}
          >
            <ListInfo
              visible={state.filteredAuthors.length}
              total={state.allAuthors.length}
            />
          </Box>
          <Box as="ol" data-testid="author-list">
            {[...groupedItems].map(([group, items], index) => {
              return (
                <Box as="li" key={group} display="block">
                  <Box
                    fontSize="medium"
                    style={{ zIndex: index + 100 }}
                    paddingTop={{ default: 0, desktop: 16 }}
                    backgroundColor="default"
                    className={stickyHeaderStyle}
                  >
                    <Box
                      backgroundColor="canvas"
                      paddingY={8}
                      paddingX={{ default: "gutter", desktop: 24 }}
                    >
                      {group}
                    </Box>
                  </Box>
                  <Box as="ol" paddingX={0}>
                    {items.map((author) => {
                      return <ListItem key={author.name} author={author} />;
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Spacer axis="vertical" size={64} />
        </Box>
      </Box>
    </Layout>
  );
}

export const pageQuery = graphql`
  fragment AuthorAvatarListItem on AuthorsJson {
    name
    slug
    sortName
    reviewedWorkCount
    workCount
    avatar {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
          formats: [JPG, AVIF]
          quality: 80
          width: 160
          height: 160
          placeholder: BLURRED
        )
      }
    }
  }
`;
