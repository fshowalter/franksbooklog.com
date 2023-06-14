import { graphql } from "gatsby";
import { rgba } from "polished";
import { toSentenceArray } from "../../utils/";
import { AuthorLink } from "../AuthorLink";
import { Box, IBoxProps } from "../Box";
import { Grade } from "../Grade";
import { GraphqlImage } from "../GraphqlImage";
import { Layout } from "../Layout";
import { LongFormText } from "../LongFormText";
import { MoreReviewsNav } from "../MoreReviews";
import { MoreReviews } from "../MoreReviews/MoreReviews";
import { MoreReviewsHeading } from "../MoreReviews/MoreReviewsHeading";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";
import { IncludedWorks } from "./IncludedWorks";
import { ReadingHistory } from "./ReadingHistory";
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
        <Box
          as="header"
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingX="pageMargin"
          width="full"
        >
          <Title reviewData={reviewData} textAlign="center" />
          <Spacer axis="vertical" size={8} />
          <YearAndKind reviewData={reviewData} />
          <Spacer axis="vertical" size={8} />
          <Authors reviewData={reviewData} />
          <Spacer axis="vertical" size={32} />
          <Cover reviewData={reviewData} />
        </Box>
        <Spacer axis="vertical" size={32} />
        <Box display="flex" flexDirection="column" paddingX="pageMargin">
          <Box display="flex" flexDirection="column" alignItems="center">
            <ReviewGrade reviewData={reviewData} />
            <ReviewDate reviewData={reviewData} />
          </Box>
          <Spacer axis="vertical" size={32} />
          <LongFormText
            maxWidth="prose"
            // eslint-disable-next-line react/no-danger
            text={reviewData.review.linkedHtml}
          />
        </Box>
        <IncludedWorks reviewData={reviewData} maxWidth="popout" width="full" />
        <Spacer axis="vertical" size={80} />
        <ReadingHistory
          reviewData={reviewData}
          maxWidth="popout"
          width="full"
        />
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
          <MoreReviewsNav>
            <MoreReviewsHeading
              leadText="More"
              linkText="Reviews"
              linkTarget="/reviews/"
            />
            <MoreReviews
              works={reviewData.browseMore}
              seeAllLinkText="Reviews"
              seeAllLinkTarget="/reviews/"
            />
          </MoreReviewsNav>
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
          <Spacer axis="vertical" size={16} />
          <Box
            fontSize="medium"
            fontWeight="normal"
            letterSpacing={0.25}
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
    <Box fontSize="medium" textAlign="center">
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
    <Box
      // width="full"
      style={{
        filter: `drop-shadow(1px 2px 8px ${rgba(
          reviewData.cover.childImageSharp?.gatsbyImageData.backgroundColor,
          0.8
        )}`,
        // border: `solid 8px ${borderColors.default}`,
      }}
      // display="flex"
      // flexDirection="column"
      // alignItems="center"
      // paddingX={16}
      // paddingY={32}
      // maxWidth="popout"
    >
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
    <Box
      display="flex"
      flexDirection="column"
      color="subtle"
      alignItems="inherit"
      letterSpacing={0.5}
    >
      <span>on</span> {reviewData.review.date}
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
      date(formatString: "ddd MMM DD, YYYY")
    }
    ...ReviewReadingHistory
    cover {
      childImageSharp {
        gatsbyImageData(
          layout: FIXED
          formats: [JPG, AVIF]
          quality: 80
          width: 248
          placeholder: DOMINANT_COLOR
        )
      }
    }
    ...ReviewStructuredData
  }
`;
