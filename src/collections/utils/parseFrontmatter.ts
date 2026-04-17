import yaml from "js-yaml";

// Capture frontmatter wrapped with `---`, including any characters and new lines within it.
// Only capture if `---` exists near the top of the file, including:
// 1. Start of file (including if has BOM encoding)
// 2. Start of file with any whitespace (but `---` or `+++` must still start on a new line)
const frontmatterRE = /(?:^\uFEFF?|^\s*\n)(?:---)([\s\S]*?\n)(?:---)/;

export function parseFrontmatter(
  fileContent: string,
  filePath: string,
): {
  body: string;
  frontmatter: Record<string, unknown>;
} {
  const frontmatterMatches = frontmatterRE.exec(fileContent);

  if (!frontmatterMatches) {
    throw new Error(`Frontmatter not found in ${filePath}`);
  }

  const rawFrontmatter = frontmatterMatches[1];

  const parsedFrontmatter = yaml.load(rawFrontmatter) as Record<
    string,
    unknown
  >;

  return {
    body: fileContent.slice(
      frontmatterMatches.index + frontmatterMatches[0].length,
    ),
    frontmatter: parsedFrontmatter,
  };
}
