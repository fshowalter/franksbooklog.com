import { perfLogger } from "~/utils/performanceLogger";

import type { AlltimeStatsJson } from "./data/alltimeStatsJson";

import { alltimeStatsJson } from "./data/alltimeStatsJson";

export type AlltimeStats = AlltimeStatsJson & {};

export async function alltimeStats(): Promise<AlltimeStats> {
  return await perfLogger.measure("alltimeStats", async () => {
    return await alltimeStatsJson();
  });
}
