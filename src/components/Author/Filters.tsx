import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Author.reducer";

import { Actions } from "./Author.reducer";

export function Filters({
  dispatch,
  distinctKinds,
  distinctPublishedYears,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
}) {
  return (
    <>
      <TextFilter
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Work Year"
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
    </>
  );
}
