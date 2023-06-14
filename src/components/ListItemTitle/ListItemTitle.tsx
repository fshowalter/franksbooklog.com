import { Box } from "../Box";
import { Link } from "../Link";

export function ListItemTitle({
  title,
  slug,
}: {
  title: string;
  slug: string | null | undefined;
}) {
  if (slug) {
    return (
      <Link to={`/reviews/${slug}/`} fontSize="medium" display="block">
        {title}
      </Link>
    );
  }

  return (
    <Box as="span" fontSize="medium" display="block">
      {title}
    </Box>
  );
}
