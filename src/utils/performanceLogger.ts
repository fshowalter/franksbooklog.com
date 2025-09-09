import { writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Represents a single timing measurement entry with start/end times and metadata.
 * Used internally by PerformanceLogger to track individual performance measurements.
 */
type TimingEntry = {
  /** The calculated duration in milliseconds (endTime - startTime) */
  duration?: number;
  /** The end timestamp from performance.now() */
  endTime?: number;
  /** Unique identifier for this timing entry */
  id: string;
  /** Optional metadata associated with this measurement */
  metadata?: Record<string, unknown>;
  /** Human-readable name for the operation being measured */
  name: string;
  /** The start timestamp from performance.now() */
  startTime: number;
};

/**
 * Performance measurement and logging utility for tracking operation timing.
 * Provides both async and sync timing capabilities with detailed reporting.
 * Automatically disabled in test environments to avoid timing conflicts.
 */
export class PerformanceLogger {
  private callCounts: Map<string, number> = new Map();
  private completedTimings: TimingEntry[] = [];
  private counter = 0;
  private timings: Map<string, TimingEntry> = new Map();

  /**
   * Ends a timing measurement by name (backward compatibility method).
   * Finds the first timing entry with matching name and ends it.
   *
   * @param name - The name of the timing to end
   * @returns Duration in milliseconds, or 0 if timing not found
   * @deprecated Use endWithId() for better precision in concurrent scenarios
   */
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

  /**
   * Ends a timing measurement by its unique ID.
   * Calculates duration, logs if debug mode is enabled, and moves entry to completed list.
   *
   * @param id - The unique ID of the timing to end
   * @returns Duration in milliseconds, or 0 if timing not found
   */
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

  /**
   * Generates a comprehensive performance report with operation statistics.
   * Groups timings by name and provides max duration, call counts, and totals.
   *
   * @returns Formatted performance report string
   */
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

  /**
   * Measures the execution time of an async function.
   * Automatically starts timing, executes the function, and ends timing.
   * Disabled in test environments to avoid timing conflicts.
   *
   * @param name - Human-readable name for the operation
   * @param fn - The async function to measure
   * @param metadata - Optional metadata to associate with this measurement
   * @returns Promise resolving to the function's return value
   */
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

  /**
   * Measures the execution time of a synchronous function.
   * Automatically starts timing, executes the function, and ends timing.
   * Disabled in test environments to avoid timing conflicts.
   *
   * @param name - Human-readable name for the operation
   * @param fn - The synchronous function to measure
   * @param metadata - Optional metadata to associate with this measurement
   * @returns The function's return value
   */
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

  /**
   * Resets all performance data and counters.
   * Clears all timing measurements, call counts, and resets the internal counter.
   */
  reset(): void {
    this.callCounts.clear();
    this.completedTimings = [];
    this.counter = 0;
    this.timings.clear();
  }

  /**
   * Starts a timing measurement with an auto-generated ID.
   * For manual timing control when you can't use measure() wrapper.
   *
   * @param name - Human-readable name for the operation
   * @param metadata - Optional metadata to associate with this measurement
   */
  start(name: string, metadata?: Record<string, unknown>): void {
    const id = `${name}_${++this.counter}_${Date.now()}`;
    this.startWithId(id, name, metadata);
  }

  /**
   * Starts a timing measurement with a specific ID.
   * Useful for precise timing control in concurrent scenarios.
   *
   * @param id - Unique identifier for this timing measurement
   * @param name - Human-readable name for the operation
   * @param metadata - Optional metadata to associate with this measurement
   */
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

  /**
   * Writes the performance report to a file in the current working directory.
   * Only executes when DEBUG_PERF environment variable is set to "true".
   * File is saved as "performance-report.txt" in the project root.
   */
  writeReportToFile(): void {
    if (process.env.DEBUG_PERF === "true") {
      const reportPath = path.join(process.cwd(), "performance-report.txt");
      writeFileSync(reportPath, this.getReport());
      console.log(`\nPerformance report written to: ${reportPath}`);
    }
  }
}

/**
 * Global performance logger instance for measuring application performance.
 * Use this singleton to track timing across the entire application.
 */
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
