import { feed } from "~/features/feed/feed";

export async function GET() {
  return await feed();
}
