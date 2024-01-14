import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ReadingsPage, { Head } from "./readings";
import { data } from "./readings.fixtures";

describe("/readings", () => {
  it("can filter by title", async () => {
    expect.hasAssertions();
    render(<ReadingsPage data={data} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Dracula");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind", async () => {
    expect.hasAssertions();
    render(<ReadingsPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by kind then show all", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    await act(async () => {
      await userEvent.selectOptions(screen.getByLabelText("Kind"), "Novel");
      await userEvent.selectOptions(screen.getByLabelText("Kind"), "All");
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by edition", async () => {
    expect.hasAssertions();
    render(<ReadingsPage data={data} />);

    await userEvent.selectOptions(screen.getByLabelText("Edition"), "Audible");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by edition then show all", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByLabelText("Edition"),
        "Audible",
      );
      await userEvent.selectOptions(screen.getByLabelText("Edition"), "All");
    });

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by reading date asc", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Reading Date (Oldest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can sort by reading date desc", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Order By"),
      "Reading Date (Newest First)",
    );

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Work Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year published reversed", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Work Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1980");
    await userEvent.selectOptions(toInput, "1989");
    await userEvent.selectOptions(fromInput, "2001");
    await userEvent.selectOptions(toInput, "1977");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year read", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Reading Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2023");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("can filter by year read reversed", async () => {
    expect.hasAssertions();

    render(<ReadingsPage data={data} />);

    const fieldset = screen.getByRole("group", { name: "Reading Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2023");
    await userEvent.selectOptions(fromInput, "2023");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("cover-list")).toMatchSnapshot();
  });

  it("sets page title", () => {
    render(<Head />);

    expect(document.title).toStrictEqual("Reading Log");
  });
});
