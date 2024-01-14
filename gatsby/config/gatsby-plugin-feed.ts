const query = `{ 
  reviewedWork: allReviewedWorksJson(limit: 25, sort: {sequence: DESC}) {
    nodes {
      review {
        excerpt
      }
      date
      sequence
      grade
      slug
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
  reviewedWork: {
    nodes: ReviewedWork[];
  };
}

interface ReviewedWork {
  grade: string;
  date: string;
  sequence: number;
  slug: string;
  authors: {
    name: string;
  }[];
  title: string;
  review: {
    excerpt: string;
  };
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

function addMetaToExcerpt(excerpt: string, reviewedWork: ReviewedWork) {
  const meta = `${starsForGrade(reviewedWork.grade)}`;
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
  return query.reviewedWork.nodes.map((reviewedWork) => {
    return {
      title: `${reviewedWork.title} by ${reviewedWork.authors
        .map((author) => author.name)
        .join(", ")}`,
      date: reviewedWork.date,
      url: `${query.site.siteMetadata.siteUrl}/reviews/${reviewedWork.slug}/`,
      guid: `${query.site.siteMetadata.siteUrl}/${reviewedWork.sequence}-${reviewedWork.slug}`,
      custom_elements: [
        {
          "content:encoded": `<img src="${
            reviewedWork.cover.childImageSharp.resize.src
          }" alt="A cover from ${reviewedWork.title}">${addMetaToExcerpt(
            reviewedWork.review.excerpt,
            reviewedWork,
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
