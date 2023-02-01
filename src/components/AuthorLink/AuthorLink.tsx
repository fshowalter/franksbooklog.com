import type { IBoxProps } from "../Box";
import { Box } from "../Box";
import { Link } from "../Link";

interface IAuthor {
  name: string;
  notes?: string | null;
  slug: string | null;
}

export interface IAuthorLinkProps extends IBoxProps {
  author: IAuthor;
  includeNotes?: boolean;
}

export function AuthorLink({
  author,
  includeNotes = true,
  ...rest
}: IAuthorLinkProps): JSX.Element {
  let notes = null;

  if (author.notes && includeNotes) {
    notes = <> ({author.notes})</>;
  }

  if (author.slug) {
    return (
      <Box {...rest}>
        <Link to={`/reviews/authors/${author.slug}/`}>{author.name}</Link>
        {notes}
      </Box>
    );
  }

  return (
    <Box {...rest}>
      {author.name}
      {notes}
    </Box>
  );
}
