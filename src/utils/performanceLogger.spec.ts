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
      expect(mockFn).toHaveBeenCalledOnce();
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
      expect(mockFn).toHaveBeenCalledOnce();
    });

    it("still returns result if function throws", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("test error"));

      await expect(
        perfLogger.measure("test-operation", mockFn),
      ).rejects.toThrow("test error");
      expect(mockFn).toHaveBeenCalledOnce();
    });

    it("skips measurement in test mode", async () => {
      vi.stubEnv("MODE", "test");
      const mockFn = vi.fn().mockResolvedValue("test-result");

      const result = await perfLogger.measure("test-operation", mockFn);

      expect(result).toBe("test-result");
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });

  describe("measureSync", () => {
    it("executes sync function and returns result", () => {
      const mockFn = vi.fn(() => "sync-result");

      const result = perfLogger.measureSync("test-sync-operation", mockFn);

      expect(result).toBe("sync-result");
      expect(mockFn).toHaveBeenCalledOnce();
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
      expect(mockFn).toHaveBeenCalledOnce();
    });

    it("still throws if function throws", () => {
      const mockFn = vi.fn((): never => {
        throw new Error("sync error");
      });

      expect(() =>
        perfLogger.measureSync("test-sync-operation", mockFn),
      ).toThrow("sync error");
      expect(mockFn).toHaveBeenCalledOnce();
    });

    it("skips measurement in test mode", () => {
      vi.stubEnv("MODE", "test");
      const mockFn = vi.fn(() => "sync-result");

      const result = perfLogger.measureSync("test-sync-operation", mockFn);

      expect(result).toBe("sync-result");
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });

  describe("start and end", () => {
    it("can manually time operations", () => {
      perfLogger.start("manual-operation");
      const duration = perfLogger.end("manual-operation");

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it("can start with metadata", () => {
      const metadata = { key: "value" };
      perfLogger.start("manual-operation", metadata);
      const duration = perfLogger.end("manual-operation");

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it("returns 0 for non-existent timing", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const duration = perfLogger.end("non-existent");

      expect(duration).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "No timing found for: non-existent",
      );
    });

    it("handles multiple concurrent operations with same name", () => {
      perfLogger.start("concurrent-op");
      perfLogger.start("concurrent-op");

      const duration1 = perfLogger.end("concurrent-op");

      expect(duration1).toBeGreaterThanOrEqual(0);
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

      perfLogger.start("fast-op");
      vi.advanceTimersByTime(5);
      perfLogger.end("fast-op");

      perfLogger.start("slow-op");
      vi.advanceTimersByTime(20);
      perfLogger.end("slow-op");

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
      perfLogger.start("op2");

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

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Performance report written to:"),
      );
    });
  });

  describe("DEBUG_PERF environment variable", () => {
    it("logs when DEBUG_PERF is true", () => {
      vi.stubEnv("DEBUG_PERF", "true");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      perfLogger.start("debug-op");
      perfLogger.end("debug-op");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[PERF] debug-op:"),
        expect.anything(),
      );
    });

    it("does not log when DEBUG_PERF is not set", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      perfLogger.start("no-debug-op");
      perfLogger.end("no-debug-op");

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("[PERF]"),
        expect.anything(),
      );
    });
  });

  describe("exported singleton", () => {
    it("exports a singleton instance that can be used", async () => {
      const { perfLogger: exportedLogger } = await import(
        "./performanceLogger"
      );

      const mockFn = vi.fn().mockResolvedValue("singleton-result");
      const result = await exportedLogger.measure("singleton-op", mockFn);

      expect(result).toBe("singleton-result");
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });
});
