const query = `
{
  review: allMarkdownRemark(
    sort: { order: DESC, fields: [frontmatter___sequence] },
    limit: 25,
    filter: { postType: { eq: "REVIEW" } }
  ) {
    nodes {
      linkedExcerpt
      frontmatter {
          date
          sequence
          grade
          slug
        }
      reviewedWork {
        title
        year
        authors {
          name
        }
        image: cover {
          childImageSharp {
            resize(toFormat: JPG, width: 500, quality: 80) {
              src
            }
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
  review: {
    nodes: Review[];
  };
}

interface Review {
  frontmatter: {
    grade: string;
    date: string;
    sequence: number;
    slug: string;
  };
  reviewedWork: {
    authors: {
      name: string;
    }[];
    title: string;
    year: string;
    image: {
      childImageSharp: {
        resize: {
          src: string;
        };
      };
    };
  };
  linkedExcerpt: string;
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

function addMetaToExcerpt(excerpt: string, review: Review) {
  const meta = `${starsForGrade(review.frontmatter.grade)}`;
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
  return query.review.nodes.map((node) => {
    return {
      title: `${node.reviewedWork.title} by ${node.reviewedWork.authors
        .map((author) => author.name)
        .join(", ")}`,
      date: node.frontmatter.date,
      url: `${query.site.siteMetadata.siteUrl}/reviews/${node.frontmatter.slug}/`,
      guid: `${query.site.siteMetadata.siteUrl}/${node.frontmatter.sequence}-${node.frontmatter.slug}`,
      custom_elements: [
        {
          "content:encoded": `<img src="${
            node.reviewedWork.image.childImageSharp.resize.src
          }" alt="A cover from ${node.reviewedWork.title}">${addMetaToExcerpt(
            node.linkedExcerpt,
            node
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
        title: "Frank's Movie Log",
        site_url: "https://www.franksbooklog.com/",
        image_url: "https://www.franksbooklog.com/assets/favicon-128.png",
      },
    ],
  },
};
