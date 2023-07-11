const query = `{ 
  readings: readingsWithReviews(
    limit: 25
  ) {
      excerpt
      date
      sequence
      grade
      slug: workSlug
      title
      authors {
        name
      }
      cover {
        childImageSharp {
          resize(toFormat: JPG, width: 500, quality: 80) {
            src
          }
        }
      }
    }
}`;

interface QueryResult {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      siteUrl: string;
    };
  };
  readings: Reading[];
}

interface Reading {
  grade: string;
  date: string;
  sequence: number;
  slug: string;
  authors: {
    name: string;
  }[];
  title: string;
  excerpt: string;
  cover: {
    childImageSharp: {
      resize: {
        src: string;
      };
    };
  };
}

const gradeMap: Record<string, string> = {
  A: "&#9733;&#9733;&#9733;&#9733;&#9733;",
  B: "&#9733;&#9733;&#9733;&#9733;",
  C: "&#9733;&#9733;&#9733;",
  D: "&#9733;&#9733;",
  F: "&#9733;",
};

function starsForGrade(grade: string) {
  if (!grade) {
    return "";
  }

  const gradeIndex = grade[0];

  if (gradeIndex in gradeMap) {
    return gradeMap[grade];
  }

  return "";
}

function addMetaToExcerpt(excerpt: string, reading: Reading) {
  const meta = `${starsForGrade(reading.grade)}`;
  return `<p>${meta}</p>${excerpt}`;
}

function setup(options: Record<string, unknown>) {
  return {
    ...options,
    custom_elements: [
      {
        'atom:link href="https://www.franksbooklog.com/feed.xml" rel="self" type="application/rss+xml"':
          null,
      },
    ],
  };
}

function serialize({ query }: { query: QueryResult }) {
  return query.readings.map((reading) => {
    return {
      title: `${reading.title} by ${reading.authors
        .map((author) => author.name)
        .join(", ")}`,
      date: reading.date,
      url: `${query.site.siteMetadata.siteUrl}/reviews/${reading.slug}/`,
      guid: `${query.site.siteMetadata.siteUrl}/${reading.sequence}-${reading.slug}`,
      custom_elements: [
        {
          "content:encoded": `<img src="${
            reading.cover.childImageSharp.resize.src
          }" alt="A cover from ${reading.title}">${addMetaToExcerpt(
            reading.title,
            reading,
          )}`,
        },
      ],
    };
  });
}

export default {
  resolve: `gatsby-plugin-feed`,
  options: {
    feeds: [
      {
        setup: setup,
        serialize: serialize,
        query,
        output: "/feed.xml",
        title: "Frank's Book Log",
        site_url: "https://www.franksbooklog.com/",
        image_url: "https://www.franksbooklog.com/assets/favicon-128.png",
      },
    ],
  },
};
