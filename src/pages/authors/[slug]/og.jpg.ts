import type { APIRoute, InferGetStaticPropsType } from "astro";
import { allAuthors } from "src/api/authors";
import { getOpenGraphAvatarAsBase64String } from "src/api/avatars";
import { OpenGraphImage } from "src/components/Author/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const authors = await allAuthors();

  return authors.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        slug: member.slug,
        name: member.name,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { slug, name } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      name,
      avatar: await getOpenGraphAvatarAsBase64String(slug),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
