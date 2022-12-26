import { graphql } from "gatsby";
import { Box, IBoxProps } from "../Box";
import { DateIcon } from "../DateIcon";
import { gridAreaComponent, gridComponent } from "../Grid";
import { RenderedMarkdown } from "../RenderedMarkdown";
import { gridAreas, gridStyle } from "./ReadingHistoryEntry.css";

const GridArea = gridAreaComponent(gridAreas);

const Grid = gridComponent(gridStyle);

function Date({ reading }: { reading: ReadingHistoryEntryFragment }) {
  return (
    <>
      <Box as="span" color="default" display="inline-block">
        {reading.dateFinished}
      </Box>{" "}
    </>
  );
}

function Edition({ reading }: { reading: ReadingHistoryEntryFragment }) {
  if (!reading.edition) {
    return null;
  }
  return (
    <Box as="span" fontWeight="light" color="muted">
      <span>via</span> <span>{reading.edition}</span>
    </Box>
  );
}

function EditionNotes({
  reading,
}: {
  reading: Queries.ReadingHistoryEntryFragment;
}) {
  if (!reading.editionNotes) {
    return null;
  }
  return (
    <Box
      as="span"
      fontWeight="light"
      color="subtle"
      fontSize="small"
      lineHeight={1}
    >
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={reading.editionNotes}
        fontSize="small"
        lineHeight={1}
        as="span"
      />
      )
    </Box>
  );
}

function Details({
  reading,
}: {
  reading: Queries.ReadingHistoryEntryFragment;
}) {
  if (!reading) {
    return null;
  }
  return (
    <Box fontWeight="light" color="subtle">
      progress...
    </Box>
  );
}

function ReadingNote({
  reading,
}: {
  reading: Queries.ReadingHistoryEntryFragment;
}) {
  if (!reading.readingNote) {
    return null;
  }
  return (
    <Box paddingBottom={24}>
      <RenderedMarkdown
        fontSize="default"
        lineHeight="default"
        // eslint-disable-next-line react/no-danger
        text={reading.readingNote.linkedHtml}
      />
    </Box>
  );
}

interface IIReadingHistoryEntryProps extends IBoxProps {
  reading: Queries.ReadingHistoryEntryFragment;
}

export function ReadingHistoryEntry({ reading }: IIReadingHistoryEntryProps) {
  return (
    <Grid backgroundColor="zebra" display="block" paddingX="gutter">
      <GridArea name="icon">
        <DateIcon />{" "}
      </GridArea>
      <GridArea name="date">
        <Date reading={reading} />
        <Edition reading={reading} /> <EditionNotes reading={reading} />
      </GridArea>
      <GridArea name="details">
        <Details reading={reading} />
      </GridArea>
      <GridArea name="viewingNote">
        <ReadingNote reading={reading} />
      </GridArea>
    </Grid>
  );
}

export const query = graphql`
  fragment ReadingHistoryEntry on ReadingsJson {
    dateStarted(formatString: "ddd MMM DD, YYYY")
    dateFinished(formatString: "ddd MMM DD, YYYY")
    edition
    editionNotes
    readingNote {
      linkedHtml
    }
    sequence
  }
`;
