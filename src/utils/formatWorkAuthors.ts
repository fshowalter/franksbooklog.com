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

export function formatWorkAuthors(
  workAuthors: {
    name: string;
    notes: string | undefined;
  }[],
  style: keyof typeof formatterMap = "long",
) {
  const formatter = formatterMap[style];

  return formatter.format(
    workAuthors.map((workAuthor) => {
      const notes = workAuthor.notes ? ` (${workAuthor.notes})` : "";

      return `${workAuthor.name}${notes}`;
    }),
  );
}
