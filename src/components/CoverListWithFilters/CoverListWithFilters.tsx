import { useReducer, useRef } from "react";
import { foregroundColors } from "../../styles/colors.css";
import { Box } from "../Box";
import { Button } from "../Button";
import { Cover, CoverList } from "../CoverList";
import { DebouncedInput } from "../DebouncedInput";
import { Fieldset } from "../Fieldset";
import { GradeInput } from "../GradeInput";
import { Layout } from "../Layout";
import { SelectField, SelectOptions } from "../SelectField";
import { Spacer } from "../Spacer";
import { YearInput } from "../YearInput";
import {
  stickyFiltersStyle,
  stickyHeaderStyle,
  stickyListInfoStyle,
} from "./CoverListWithFilters.css";
import type { Sort } from "./CoverListWithFilters.reducer";
import { ActionType, initState, reducer } from "./CoverListWithFilters.reducer";

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
    showingText = `Showing 1-${visible} of ${total.toLocaleString()}`;
  }

  return <div>{showingText}</div>;
}

function groupForItem(
  item: ICoverListWithFiltersItem,
  sortValue: Sort
): string {
  const shortMonthToLong: Record<string, string> = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  };

  switch (sortValue) {
    case "year-published-asc":
    case "year-published-desc": {
      return item.yearPublished.toString();
    }
    case "sequence-asc":
    case "sequence-desc": {
      if (!item.dateFinished) {
        return "";
      }
      const match = item.dateFinished.match(/([A-Za-z]{3}) \d{1,2}, (\d{4})/);
      if (!match) {
        return "Unknown";
      }

      return `${shortMonthToLong[match[1]]} ${match[2]}`;
    }
    case "grade-asc":
    case "grade-desc": {
      return item.grade ?? "Unrated";
    }
    case "author-asc":
    case "author-desc": {
      if (!item.authors) {
        return "Unknown";
      }

      return item.authors[0].sortName[0];
    }
    case "title": {
      const letter = item.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

function groupItems({
  items,
  sortValue,
}: {
  items: ICoverListWithFiltersItem[];
  sortValue: Sort;
}): Map<string, ICoverListWithFiltersItem[]> {
  const groupedItems = new Map<string, ICoverListWithFiltersItem[]>();

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

export function CoverListWithFilters({
  items,
  children,
  distinctEditions,
  distinctReadYears,
  distinctPublishedYears,
  distinctKinds,
  distinctGrades,
  distinctAuthors,
  initialSort,
  toggleReviewed = false,
  coverDetails,
}: {
  items: readonly ICoverListWithFiltersItem[];
  children: React.ReactNode;
  distinctEditions?: readonly string[];
  distinctReadYears?: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctKinds: readonly string[];
  distinctGrades?: readonly string[];
  distinctAuthors?: readonly string[];
  initialSort: Sort;
  toggleReviewed?: boolean;
  coverDetails?: (item: ICoverListWithFiltersItem) => React.ReactNode;
}): JSX.Element {
  const is = initState({
    items: [...items],
    sort: initialSort,
  });

  const [state, dispatch] = useReducer(reducer, is);

  const listHeader = useRef<HTMLDivElement>(null);

  const groupedItems = groupItems({
    items: state.filteredItems.slice(0, state.showCount),
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
          paddingX={{ default: "gutter", desktop: 0 }}
          paddingTop={32}
          flexBasis={352}
        >
          <Box maxWidth="prose" width="full">
            {children}
          </Box>
          <Spacer axis="vertical" size={32} />
          <Box className={stickyFiltersStyle}>
            <Fieldset legend="Filter & Sort">
              {toggleReviewed && (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={() =>
                      dispatch({ type: ActionType.TOGGLE_REVIEWED })
                    }
                  >
                    {state.hideReviewed ? "Show Reviewed" : "Hide Reviewed"}
                  </Button>
                </Box>
              )}
              <DebouncedInput
                label="Title"
                placeholder="Enter all or part of a title"
                onInputChange={(value) =>
                  dispatch({ type: ActionType.FILTER_TITLE, value })
                }
              />
              <YearInput
                label="Year Published"
                years={distinctPublishedYears}
                onYearChange={(values) =>
                  dispatch({ type: ActionType.FILTER_YEAR_PUBLISHED, values })
                }
              />
              {distinctReadYears && (
                <YearInput
                  label="Year Read"
                  years={distinctReadYears}
                  onYearChange={(values) =>
                    dispatch({ type: ActionType.FILTER_YEAR_READ, values })
                  }
                />
              )}
              {distinctGrades && (
                <GradeInput
                  label="Grade"
                  onGradeChange={(values, includeAbandoned) =>
                    dispatch({
                      type: ActionType.FILTER_GRADE,
                      values,
                      includeAbandoned,
                    })
                  }
                />
              )}
              <SelectField
                label="Kind"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.FILTER_KIND,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={distinctKinds} />
              </SelectField>
              {distinctEditions && (
                <SelectField
                  label="Edition"
                  onChange={(e) =>
                    dispatch({
                      type: ActionType.FILTER_EDITION,
                      value: e.target.value,
                    })
                  }
                >
                  <SelectOptions options={distinctEditions} />
                </SelectField>
              )}
              {distinctAuthors && (
                <SelectField
                  label="Author"
                  onChange={(e) =>
                    dispatch({
                      type: ActionType.FILTER_AUTHOR,
                      value: e.target.value,
                    })
                  }
                >
                  <SelectOptions options={distinctAuthors} />
                </SelectField>
              )}
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
                {distinctReadYears && (
                  <>
                    <option value="sequence-desc">
                      Date Read (Newest First)
                    </option>
                    <option value="sequence-asc">
                      Date Read (Oldest First)
                    </option>
                  </>
                )}
                <option value="year-published-desc">
                  Year Published (Newest First)
                </option>
                <option value="year-published-asc">
                  Year Published (Oldest First)
                </option>
                <option value="title">Title</option>
                <option value="grade-desc">Grade (Best First)</option>
                <option value="grade-asc">Grade (Worst First)</option>
                <option value="author-asc">Auther (A &rarr; Z)</option>
                <option value="author-desc">Author (Z &rarr; A)</option>
              </SelectField>
            </Fieldset>
          </Box>
          <Spacer axis="vertical" size={32} />
        </Box>
        <Box
          name="list"
          innerRef={listHeader}
          display="flex"
          flexDirection="column"
          flexGrow={1}
        >
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
              visible={state.showCount}
              total={state.filteredItems.length}
            />
          </Box>
          <Box as="ol" data-testid="cover-list">
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
                  <Spacer axis="vertical" size={{ default: 0, tablet: 16 }} />
                  <CoverList
                    paddingX={{
                      default: 0,
                      tablet: "gutter",
                      desktop: 0,
                    }}
                  >
                    {items.map((item) => {
                      return (
                        <Cover
                          key={item.sequence}
                          title={item.title}
                          year={item.yearPublished}
                          grade={item.grade}
                          date={item.dateFinished}
                          kind={item.kind}
                          edition={item.edition}
                          slug={item.slug}
                          image={item.cover}
                          authors={item.authors}
                          details={
                            coverDetails ? coverDetails(item) : undefined
                          }
                        />
                      );
                    })}
                  </CoverList>
                  <Spacer axis="vertical" size={{ default: 0, tablet: 16 }} />
                </Box>
              );
            })}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingX="pageMargin"
          >
            {state.filteredItems.length > state.showCount && (
              <>
                <Spacer axis="vertical" size={32} />
                <Button
                  paddingX="pageMargin"
                  onClick={() => dispatch({ type: ActionType.SHOW_MORE })}
                  display="flex"
                  columnGap={16}
                >
                  <svg
                    width="24"
                    height="24"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={foregroundColors.accent}
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                  </svg>
                  Show More...
                </Button>
                <Spacer axis="vertical" size={32} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

export interface ICoverListWithFiltersItem {
  sequence?: number;
  title: string;
  sortTitle: string;
  yearFinished?: number;
  yearPublished: number;
  dateFinished?: string;
  kind: string;
  edition?: string;
  grade?: string | null;
  gradeValue?: number | null;
  slug: string | null;
  authors?: readonly {
    name: string;
    notes?: string | null;
    sortName: string;
  }[];
  cover: {
    childImageSharp: {
      gatsbyImageData: import("gatsby-plugin-image").IGatsbyImageData;
    } | null;
  };
}
