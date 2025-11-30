import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PerformanceLogger } from "./performanceLogger";

describe("PerformanceLogger", () => {
  let perfLogger: PerformanceLogger;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("MODE", "production");
    perfLogger = new PerformanceLogger();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("measure", () => {
    it("executes async function and returns result", async () => {
      const mockFn = vi.fn().mockResolvedValue("test-result");

      const result = await perfLogger.measure("test-operation", mockFn);

      expect(result).toBe("test-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("executes async function with metadata", async () => {
      const mockFn = vi.fn().mockResolvedValue("test-result");
      const metadata = { key: "value" };

      const result = await perfLogger.measure(
        "test-operation",
        mockFn,
        metadata,
      );

      expect(result).toBe("test-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("still returns result if function throws", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("test error"));

      await expect(
        perfLogger.measure("test-operation", mockFn),
      ).rejects.toThrow("test error");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("skips measurement in test mode", async () => {
      vi.stubEnv("MODE", "test");
      const mockFn = vi.fn().mockResolvedValue("test-result");

      const result = await perfLogger.measure("test-operation", mockFn);

      expect(result).toBe("test-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("measureSync", () => {
    it("executes sync function and returns result", () => {
      const mockFn = vi.fn(() => "sync-result");

      const result = perfLogger.measureSync("test-sync-operation", mockFn);

      expect(result).toBe("sync-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("executes sync function with metadata", () => {
      const mockFn = vi.fn(() => "sync-result");
      const metadata = { key: "value" };

      const result = perfLogger.measureSync(
        "test-sync-operation",
        mockFn,
        metadata,
      );

      expect(result).toBe("sync-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("still throws if function throws", () => {
      const mockFn = vi.fn((): never => {
        throw new Error("sync error");
      });

      expect(() =>
        perfLogger.measureSync("test-sync-operation", mockFn),
      ).toThrow("sync error");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });

    it("skips measurement in test mode", () => {
      vi.stubEnv("MODE", "test");
      const mockFn = vi.fn(() => "sync-result");

      const result = perfLogger.measureSync("test-sync-operation", mockFn);

      expect(result).toBe("sync-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("concurrent operations", () => {
    it("handles multiple concurrent operations with same name", async () => {
      const results = await Promise.all([
        perfLogger.measure("concurrent-op", async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          return "result1";
        }),
        perfLogger.measure("concurrent-op", async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return "result2";
        }),
      ]);

      expect(results).toEqual(["result1", "result2"]);
    });

    it("can measure operations with metadata", async () => {
      const metadata = { key: "value" };
      const result = await perfLogger.measure(
        "metadata-op",
        () => Promise.resolve("test-result"),
        metadata,
      );

      expect(result).toBe("test-result");
    });
  });

  describe("getReport", () => {
    it("generates empty report when no operations measured", () => {
      const report = perfLogger.getReport();

      expect(report).toContain("Performance Report");
      expect(report).toContain("Top 50 Slowest Operations");
      expect(report).toContain("Operation Call Frequency");
    });

    it("includes measured operations in report", async () => {
      await perfLogger.measure("report-test-op", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "result";
      });

      const report = perfLogger.getReport();

      expect(report).toContain("report-test-op");
      expect(report).toMatch(/\d+\.\d+/);
    });

    it("aggregates multiple calls of same operation", async () => {
      for (let index = 0; index < 3; index++) {
        await perfLogger.measure("repeated-op", async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          return index;
        });
      }

      const report = perfLogger.getReport();

      expect(report).toContain("repeated-op");
      expect(report).toMatch(/Calls:\s+3/);
    });

    it("sorts operations by max duration", () => {
      vi.useFakeTimers();

      perfLogger.measureSync("fast-op", () => {
        vi.advanceTimersByTime(5);
        return "fast-result";
      });

      perfLogger.measureSync("slow-op", () => {
        vi.advanceTimersByTime(20);
        return "slow-result";
      });

      vi.useRealTimers();

      const report = perfLogger.getReport();
      const lines = report.split("\n");

      let slowLine = -1;
      let fastLine = -1;

      // Only check lines in the operations table section (before Operation Call Frequency)
      const frequencyStart = lines.findIndex((line) =>
        line.includes("Operation Call Frequency"),
      );

      for (let i = 0; i < frequencyStart; i++) {
        if (lines[i].includes("slow-op") && lines[i].includes("|")) {
          slowLine = i;
        }
        if (lines[i].includes("fast-op") && lines[i].includes("|")) {
          fastLine = i;
        }
      }

      expect(slowLine).toBeGreaterThan(0);
      expect(fastLine).toBeGreaterThan(0);
      // Slow operation should appear first (lower line number) since it has higher duration
      expect(slowLine).toBeLessThan(fastLine);
    });

    it("includes summary statistics", async () => {
      await perfLogger.measure("stats-op", () => Promise.resolve("result"));

      const report = perfLogger.getReport();

      expect(report).toMatch(/Total operations measured: \d+/);
      expect(report).toMatch(/Total unique operation types: \d+/);
      expect(report).toMatch(/Total time: \d+\.\d+ms/);
    });
  });

  describe("reset", () => {
    it("clears all internal state", async () => {
      await perfLogger.measure("op1", () => Promise.resolve("result1"));
      perfLogger.measureSync("op2", () => "result2");

      perfLogger.reset();

      const report = perfLogger.getReport();
      expect(report).not.toContain("op1");
      expect(report).not.toContain("op2");
      expect(report).toMatch(/Total operations measured: 0/);
    });
  });

  describe("writeReportToFile", () => {
    it("does nothing when DEBUG_PERF is not true", () => {
      const writeFileSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      perfLogger.writeReportToFile();

      expect(writeFileSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("Performance report written to:"),
      );
    });

    it("writes report when DEBUG_PERF is true", () => {
      vi.stubEnv("DEBUG_PERF", "true");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      perfLogger.writeReportToFile();

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
        expect.stringContaining("Performance report written to:"),
      );
    });
  });

  describe("DEBUG_PERF environment variable", () => {
    it("logs when DEBUG_PERF is true", () => {
      vi.stubEnv("DEBUG_PERF", "true");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      perfLogger.measureSync("debug-op", () => "result");

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
        expect.stringContaining("[PERF] debug-op:"),
        expect.anything(),
      );
    });

    it("does not log when DEBUG_PERF is not set", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      perfLogger.measureSync("no-debug-op", () => "result");

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("[PERF]"),
        expect.anything(),
      );
    });
  });

  describe("exported singleton", () => {
    it("exports a singleton instance that can be used", async () => {
      const { perfLogger: exportedLogger } =
        await import("./performanceLogger");

      const mockFn = vi.fn().mockResolvedValue("singleton-result");
      const result = await exportedLogger.measure("singleton-op", mockFn);

      expect(result).toBe("singleton-result");
      expect(mockFn).toHaveBeenCalledExactlyOnceWith();
    });
  });
});
