import type { AlltimeStatsJson } from "./data/alltimeStatsJson";

import { alltimeStatsJson } from "./data/alltimeStatsJson";

export type AlltimeStats = {} & AlltimeStatsJson;

export async function alltimeStats(): Promise<AlltimeStats> {
  return await alltimeStatsJson();
}
