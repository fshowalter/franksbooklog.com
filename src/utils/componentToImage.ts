import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import fs from "node:fs/promises";

const fonts = [
  {
    data: await fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-ExtraBold.ttf",
    ),
    name: "FrankRuhlLibre",
    weight: 800,
  },
  {
    data: await fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-SemiBold.ttf",
    ),
    name: "FrankRuhlLibre",
    weight: 600,
  },
  {
    data: await fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf",
    ),
    name: "FrankRuhlLibre",
    weight: 400,
  },
  {
    data: await fs.readFile("./public/fonts/Assistant/Assistant-Bold.ttf"),
    name: "Assistant",
    weight: 700,
  },
  {
    data: await fs.readFile("./public/fonts/Assistant/Assistant-SemiBold.ttf"),
    name: "Assistant",
    weight: 600,
  },
];

const renderer = new Renderer({
  fonts,
});

export async function componentToImageBytes(
  component: Parameters<typeof fromJsx>[0],
  fetchedResources: { data: ArrayBuffer; src: string }[],
): Promise<Buffer> {
  const { node, stylesheets } = await fromJsx(component);

  return await renderer.render(node, {
    fetchedResources,
    format: "jpeg",
    height: 630,
    stylesheets,
    width: 1200,
  });
}

export async function componentToImageResponse(
  component: Parameters<typeof fromJsx>[0],
  fetchedResources: { data: ArrayBuffer; src: string }[],
): Promise<Response> {
  const image = await componentToImageBytes(component, fetchedResources);

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
}
