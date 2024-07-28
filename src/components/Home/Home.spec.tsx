import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { getProps } from "./getProps";
import { Home } from "./Home";

const props = await getProps();

describe("Home", () => {
  it("matches snapshot", { timeout: 40000 }, ({ expect }) => {
    const { asFragment } = render(<Home {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
