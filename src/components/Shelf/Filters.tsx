import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { YearInput } from "~/components/YearInput";

import type { ActionType, Sort } from "./Shelf.reducer";

import { Actions } from "./Shelf.reducer";

export function Filters({
  dispatch,
  distinctAuthors,
  distinctKinds,
  distinctPublishedYears,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctAuthors: readonly string[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  sortValue: string;
}) {
  return (
    <>
      <DebouncedInput
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Year Published"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_YEAR_PUBLISHED, values })
        }
        years={distinctPublishedYears}
      />
      <SelectField
        label="Kind"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_KIND,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctKinds} />
      </SelectField>
      <SelectField
        label="Author"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_AUTHOR,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctAuthors} />
      </SelectField>
      <SelectField
        label="Order By"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
        value={sortValue}
      >
        <option value="author-asc">Author (A &rarr; Z)</option>
        <option value="author-desc">Author (Z &rarr; A)</option>
        <option value="year-published-desc">
          Year Published (Newest First)
        </option>
        <option value="year-published-asc">
          Year Published (Oldest First)
        </option>
        <option value="title-asc">Title (A &rarr; Z)</option>
        <option value="title-desc">Title (Z &rarr; A)</option>
      </SelectField>
    </>
  );
}
