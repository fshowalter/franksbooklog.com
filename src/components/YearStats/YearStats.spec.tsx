import { render } from "@testing-library/react";
import { allStatYears } from "src/api/yearStats";
import { describe, it } from "vitest";

import { getProps } from "./getProps";
import { YearStats } from "./YearStats";

const statYears = await allStatYears();

describe("YearStats", () => {
  it.for(statYears)(
    "matches snapshot for slug %i",
    { timeout: 10000 },
    async (year, { expect }) => {
      const props = await getProps(year);

      const { asFragment } = render(<YearStats {...props} />);

      expect(asFragment()).toMatchSnapshot();
    },
  );
});
