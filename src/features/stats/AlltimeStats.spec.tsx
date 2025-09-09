import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { AlltimeStats } from "./AlltimeStats";
import { getAlltimeStatsProps } from "./getProps";

const props = await getAlltimeStatsProps();

describe("/readings/stats", () => {
  it("matches snapshot", { timeout: 40_000 }, ({ expect }) => {
    const { asFragment } = render(<AlltimeStats {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
