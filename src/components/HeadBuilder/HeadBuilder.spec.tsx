jest.unmock("./HeadBuilder");
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router";
import { render } from "@testing-library/react";
import { useStaticQuery } from "gatsby";
import Seo from "./HeadBuilder";

const source = createMemorySource("test");
const history = createHistory(source);

describe("Seo", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementationOnce(() => ({
      site: {
        siteMetadata: {
          siteTitle: "Frank's Movie Log",
          siteUrl: "https://www.franksmovielog.com/",
          siteImage: "assets/default_og.jpg",
        },
      },
    }));
  });

  it("sets meta", () => {
    expect.hasAssertions();
    render(
      <LocationProvider history={history}>
        <Seo pageTitle="Test Page" description="A generic description." />
      </LocationProvider>,
      { container: document.head }
    );

    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <title>
          Test Page | Frank's Movie Log
        </title>
        <meta
          content="A generic description."
          name="description"
        />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
        <meta
          content="https://www.franksmovielog.com/assets/default_og.jpg"
          name="og:image"
        />
        <meta
          content="https://www.franksmovielog.com/test"
          property="og:url"
        />
        <meta
          content="Test Page | Frank's Movie Log"
          property="og:title"
        />
        <meta
          content="A generic description."
          property="og:description"
        />
      </head>
    `);
  });

  it("sets meta for articles", () => {
    render(
      <LocationProvider history={history}>
        <Seo
          pageTitle="Test Page"
          description="A generic description."
          article
        />
      </LocationProvider>,
      { container: document.head }
    );

    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <title>
          Test Page | Frank's Movie Log
        </title>
        <meta
          content="A generic description."
          name="description"
        />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
        <meta
          content="https://www.franksmovielog.com/assets/default_og.jpg"
          name="og:image"
        />
        <meta
          content="https://www.franksmovielog.com/test"
          property="og:url"
        />
        <meta
          content="article"
          property="og:type"
        />
        <meta
          content="Test Page | Frank's Movie Log"
          property="og:title"
        />
        <meta
          content="A generic description."
          property="og:description"
        />
      </head>
    `);
  });

  it("does not set sub-title on root", () => {
    render(
      <LocationProvider history={history}>
        <Seo
          pageTitle="Frank's Movie Log"
          description="A generic description."
          article
        />
      </LocationProvider>,
      { container: document.head }
    );

    expect(document.title).toStrictEqual("Frank's Movie Log");
  });
});
