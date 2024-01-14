import path from "path";
import type {
  GatsbyNodeContext,
  GatsbyResolveArgs,
} from "../../type-definitions";

function findCover(context: GatsbyNodeContext, filename: string) {
  return context.nodeModel.findOne({
    type: "File",
    query: {
      filter: {
        absolutePath: {
          eq: path.resolve(`./content/assets/covers/${filename}.png`),
        },
      },
    },
  });
}

export async function coverResolver(
  source: {
    slug: string;
    includedInSlugs: string[];
  },
  _args: GatsbyResolveArgs,
  context: GatsbyNodeContext,
) {
  const cover = await findCover(context, source.slug);

  if (cover) {
    return cover;
  }

  for (let i = 0; i < source.includedInSlugs.length; i++) {
    const parentWorkCover = await findCover(context, source.includedInSlugs[i]);

    if (parentWorkCover) {
      return parentWorkCover;
    }
  }

  return findCover(context, "default");
}
