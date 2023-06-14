import { Box, IBoxProps } from "../Box";
import { Link } from "../Link";

interface IListItemTitleProps extends IBoxProps {
  title: string;
  slug: string | null | undefined;
}

export function ListItemTitle({ title, slug, ...rest }: IListItemTitleProps) {
  if (slug) {
    return (
      <Link
        to={`/reviews/${slug}/`}
        fontSize="medium"
        lineHeight={20}
        display="block"
        {...rest}
      >
        {title}
      </Link>
    );
  }

  return (
    <Box as="span" fontSize="medium" display="block" lineHeight={20} {...rest}>
      {title}
    </Box>
  );
}
