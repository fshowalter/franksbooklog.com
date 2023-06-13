import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils/";
import { AuthorLink } from "../AuthorLink";
import { Box, IBoxProps } from "../Box";
import { DateIcon } from "../DateIcon";
import { Grade } from "../Grade";
import { GraphqlImage } from "../GraphqlImage";
import { Layout } from "../Layout";
import { LongFormText } from "../LongFormText";
import { MoreReviews } from "../MoreReviews/MoreReviews";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";
import { IncludedWorks } from "./IncludedWorks";
import { ReadingHistory } from "./ReadingHistory";
import { coverStyle, desktopMarginStyle } from "./Review.css";
import { StructuredData } from "./StructuredData";
export function Review({
  reviewData,
}: {
  reviewData: Queries.ReviewDataFragment;
}): JSX.Element {
  return (
    <Layout>
      <Box
        as="main"
        id="top"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingTop={{ default: 24, desktop: 48 }}
      >
        <Box className={desktopMarginStyle} maxWidth="popout" width="full">
          <Box
            as="header"
            display="flex"
            flexDirection="column"
            alignItems={{ default: "center", desktop: "flex-start" }}
            paddingX={{ default: "pageMargin", desktop: "gutter" }}
            width="full"
          >
            <Title
              reviewData={reviewData}
              textAlign={{ default: "center", desktop: "left" }}
            />
            <Spacer axis="vertical" size={8} />
            <Authors reviewData={reviewData} />
            <Spacer axis="vertical" size={{ default: 8, desktop: 16 }} />
            <YearAndKind reviewData={reviewData} />
            <Spacer axis="vertical" size={16} />
            <Cover reviewData={reviewData} />
            <Spacer axis="vertical" size={{ default: 16, desktop: 0 }} />
            <ReviewGrade reviewData={reviewData} />
            <Spacer axis="vertical" size={{ default: 16, desktop: 24 }} />
            <ReviewDate reviewData={reviewData} />
            <Spacer axis="vertical" size={32} />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            paddingX={{ default: "pageMargin", desktop: "gutter" }}
          >
            <LongFormText
              maxWidth="prose"
              // eslint-disable-next-line react/no-danger
              text={reviewData.review.linkedHtml}
            />
          </Box>
          <IncludedWorks
            reviewData={reviewData}
            // maxWidth="popout"
            width="full"
          />
          <Spacer axis="vertical" size={80} />
          <ReadingHistory
            reviewData={reviewData}
            maxWidth="popout"
            width="full"
          />
        </Box>
        <Spacer axis="vertical" size={128} />
        <Box
          display="flex"
          flexDirection="column"
          rowGap={{ default: 48, desktop: 96 }}
          alignItems="center"
          backgroundColor={{ default: "default", tablet: "subtle" }}
          paddingTop={{ default: 0, tablet: 32 }}
          paddingBottom={{ default: 0, tablet: 128 }}
          width="full"
        >
          <MoreReviews
            reviewedWorks={reviewData.browseMore}
            linkText="Reviews"
            linkTarget="/reviews/"
          />
        </Box>
      </Box>
      <StructuredData reviewStructuredData={reviewData} />
    </Layout>
  );
}

interface ITitleProps extends IBoxProps {
  reviewData: Queries.ReviewDataFragment;
}

function Title({ reviewData, ...rest }: ITitleProps) {
  return (
    <Box {...rest}>
      <PageTitle>{reviewData.title}</PageTitle>
      {reviewData.subtitle && (
        <>
          <Spacer axis="vertical" size={8} />
          <Box
            fontSize="default"
            letterSpacing={1}
            color="muted"
            maxWidth="prose"
          >
            {reviewData.subtitle}
          </Box>
        </>
      )}
    </Box>
  );
}

function YearAndKind({
  reviewData,
}: {
  reviewData: Queries.ReviewDataFragment;
}) {
  return (
    <Box textTransform="uppercase" color="subtle" letterSpacing={1}>
      <Box as="span" letterSpacing={0.25}>
        {reviewData.yearPublished}
      </Box>{" "}
      | {reviewData.kind}
    </Box>
  );
}

function Authors({ reviewData }: { reviewData: Queries.ReviewDataFragment }) {
  return (
    <Box fontSize="medium" textAlign="center" color="muted">
      by{" "}
      {toSentenceArray(
        reviewData.authors.map((author) => (
          <AuthorLink
            key={author.slug}
            author={author}
            display="inline-block"
          />
        ))
      )}
    </Box>
  );
}

function Cover({ reviewData }: { reviewData: Queries.ReviewDataFragment }) {
  return (
    <Box className={coverStyle}>
      <GraphqlImage
        image={reviewData.cover}
        alt={`A cover of ${reviewData.title} by ${toSentenceArray(
          reviewData.authors.map((a) => a.name)
        ).join("")} (${reviewData.yearPublished})`}
        loading={"eager"}
      />
    </Box>
  );
}

function ReviewGrade({
  reviewData,
}: {
  reviewData: Queries.ReviewDataFragment;
}) {
  if (reviewData.grade == "Abandoned") {
    return (
      <Box
        fontSize="medium"
        textTransform="uppercase"
        letterSpacing={1}
        color="emphasis"
      >
        Abandoned
      </Box>
    );
  }
  return <Grade grade={reviewData.grade} height={32} />;
}

function ReviewDate({
  reviewData,
}: {
  reviewData: Queries.ReviewDataFragment;
}) {
  return (
    <Box display="flex" color="subtle" alignItems="center" letterSpacing={0.5}>
      <DateIcon /> {reviewData.review.date}
    </Box>
  );
}

export const pageQuery = graphql`
  fragment ReviewData on ReviewedWorksJson {
    title
    subtitle
    yearPublished
    kind
    grade
    authors {
      name
      notes
      slug
    }
    ...ReviewIncludedWorks
    browseMore {
      ...MoreReviews
    }
    review {
      linkedHtml
      date(formatString: "MMM DD, YYYY")
    }
    ...ReviewReadingHistory
    cover {
      childImageSharp {
        gatsbyImageData(
          layout: FIXED
          formats: [JPG, AVIF]
          quality: 80
          width: 200
          placeholder: BLURRED
        )
      }
    }
    ...ReviewStructuredData
  }
`;
