const longFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const shortFormatter = new Intl.ListFormat("en", {
  style: "short",
  type: "conjunction",
});

const formatterMap: Record<string, Intl.ListFormat> = {
  long: longFormatter,
  short: shortFormatter,
};

export function formatTitleAuthors(
  titleAuthors: {
    name: string;
    notes: string | undefined;
    sortName?: string | undefined;
  }[],
  args: {
    style?: keyof typeof formatterMap;
    useSortName?: boolean;
  } = {},
) {
  const { style = "long", useSortName = false } = args;

  const formatter = formatterMap[style];

  return formatter.format(
    titleAuthors.map((titleAuthor) => {
      const notes = titleAuthor.notes ? ` (${titleAuthor.notes})` : "";

      return `${useSortName ? (titleAuthor.sortName ?? titleAuthor.name) : titleAuthor.name}${notes}`;
    }),
  );
}
