import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { allStatYears } from "~/api/yearStats";

import { getProps } from "./getProps";
import { YearStats } from "./YearStats";

const statYears = await allStatYears();

describe("YearStats", () => {
  it.for(statYears)(
    "matches snapshot for slug %i",
    { timeout: 10_000 },
    async (year, { expect }) => {
      const props = await getProps(year);

      const { asFragment } = render(<YearStats {...props} />);

      expect(asFragment()).toMatchSnapshot();
    },
  );
});
