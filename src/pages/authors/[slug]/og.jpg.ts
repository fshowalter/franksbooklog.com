import type { APIRoute, InferGetStaticPropsType } from "astro";

import { allAuthors } from "~/api/authors";
import { getOpenGraphAvatarAsBase64String } from "~/api/avatars";
import { OpenGraphImage } from "~/components/Author/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const authors = await allAuthors();

  return authors.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        name: member.name,
        slug: member.slug,
      },
    };
  });
}

export const GET: APIRoute = async function get({ props }) {
  const { name, slug } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      avatar: await getOpenGraphAvatarAsBase64String(slug),
      name,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
