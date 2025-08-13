import { writeFileSync } from "node:fs";
import path from "node:path";

type TimingEntry = {
  duration?: number;
  endTime?: number;
  id: string;
  metadata?: Record<string, unknown>;
  name: string;
  startTime: number;
};

class PerformanceLogger {
  private callCounts: Map<string, number> = new Map();
  private completedTimings: TimingEntry[] = [];
  private counter = 0;
  private timings: Map<string, TimingEntry> = new Map();

  end(name: string): number {
    // For backward compatibility, try to find by name pattern
    const entry = [...this.timings.entries()].find(
      ([, timing]) => timing.name === name,
    );
    if (!entry) {
      console.warn(`No timing found for: ${name}`);
      return 0;
    }
    return this.endWithId(entry[0]);
  }

  endWithId(id: string): number {
    const timing = this.timings.get(id);
    if (!timing) {
      return 0;
    }

    timing.endTime = performance.now();
    timing.duration = timing.endTime - timing.startTime;

    this.completedTimings.push(timing);
    this.timings.delete(id);

    if (process.env.DEBUG_PERF === "true") {
      console.log(
        `[PERF] ${timing.name}: ${timing.duration.toFixed(2)}ms`,
        timing.metadata || "",
      );
    }

    return timing.duration;
  }

  getReport(): string {
    // Group timings to get aggregated stats - use exact name matching
    const operationStats = new Map<
      string,
      { calls: number; maxTime: number; totalTime: number }
    >();
    for (const timing of this.completedTimings) {
      const stats = operationStats.get(timing.name) || {
        calls: 0,
        maxTime: 0,
        totalTime: 0,
      };
      stats.totalTime += timing.duration || 0;
      stats.maxTime = Math.max(stats.maxTime, timing.duration || 0);
      stats.calls++;
      operationStats.set(timing.name, stats);
    }

    // Create a list of unique operations sorted by their max duration
    const uniqueOperations = [...operationStats.entries()]
      .map(([name, stats]) => ({
        calls: stats.calls,
        duration: stats.maxTime,
        name,
        totalTime: stats.totalTime,
      }))
      .sort((a, b) => b.duration - a.duration);

    let report = "\n=== Performance Report ===\n\n";
    report += "Top 50 Slowest Operations (by max duration):\n";
    report += "-".repeat(100) + "\n";
    report +=
      "Rank | Operation                                         | Max (ms)      | Calls | Total (ms)\n";
    report += "-".repeat(100) + "\n";

    for (const [index, op] of uniqueOperations.slice(0, 50).entries()) {
      report += `${(index + 1).toString().padStart(4)} | ${op.name.padEnd(50)} | ${op.duration.toFixed(2).padStart(13)} | ${op.calls.toString().padStart(5)} | ${op.totalTime.toFixed(2).padStart(10)}\n`;
    }

    report += "\n" + "-".repeat(100) + "\n";
    report += "\nOperation Call Frequency (Top 20):\n";
    report += "-".repeat(60) + "\n";

    const sortedCallCounts = [...this.callCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    for (const [name, count] of sortedCallCounts) {
      const stats = operationStats.get(name);
      const displayName = name.length > 40 ? name.slice(0, 37) + "..." : name;
      report += `${displayName.padEnd(40)} | Calls: ${count.toString().padStart(6)} | Total: ${(stats?.totalTime || 0).toFixed(2).padStart(10)}ms\n`;
    }

    report += "\n" + "-".repeat(100) + "\n";
    report += `Total operations measured: ${this.completedTimings.length}\n`;
    report += `Total unique operation types: ${this.callCounts.size}\n`;
    report += `Total time: ${this.completedTimings.reduce((sum, t) => sum + (t.duration || 0), 0).toFixed(2)}ms\n`;

    return report;
  }

  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>,
  ): Promise<T> {
    // Skip performance tracking in test environments to avoid timing conflicts
    if (import.meta.env.MODE === "test") {
      return await fn();
    }

    // Use unique ID to avoid timing conflicts in parallel execution
    const id = `${name}_${++this.counter}_${Date.now()}`;
    this.startWithId(id, name, metadata);
    try {
      const result = await fn();
      return result;
    } finally {
      this.endWithId(id);
    }
  }

  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, unknown>,
  ): T {
    // Skip performance tracking in test environments to avoid timing conflicts
    if (import.meta.env.MODE === "test") {
      return fn();
    }

    // Use unique ID to avoid timing conflicts
    const id = `${name}_${++this.counter}_${Date.now()}`;
    this.startWithId(id, name, metadata);
    try {
      const result = fn();
      return result;
    } finally {
      this.endWithId(id);
    }
  }

  start(name: string, metadata?: Record<string, unknown>): void {
    const id = `${name}_${++this.counter}_${Date.now()}`;
    this.startWithId(id, name, metadata);
  }

  startWithId(
    id: string,
    name: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.timings.set(id, {
      id,
      metadata,
      name,
      startTime: performance.now(),
    });

    // Track call counts - use full name for accuracy
    this.callCounts.set(name, (this.callCounts.get(name) || 0) + 1);
  }

  writeReportToFile(): void {
    if (process.env.DEBUG_PERF === "true") {
      const reportPath = path.join(process.cwd(), "performance-report.txt");
      writeFileSync(reportPath, this.getReport());
      console.log(`\nPerformance report written to: ${reportPath}`);
    }
  }
}

export const perfLogger = new PerformanceLogger();

// Write report on process exit
process.on("exit", () => {
  if (process.env.DEBUG_PERF === "true") {
    console.log(perfLogger.getReport());
    try {
      perfLogger.writeReportToFile();
    } catch (error) {
      console.error("Failed to write performance report:", error);
    }
  }
});
