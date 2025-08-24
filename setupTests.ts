import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Set up vitest-fail-on-console to catch unexpected console.error and console.warn
// Using defaults: fails on error and warn, allows log/info/debug
failOnConsole();

// Mock scrollIntoView which is not available in jsdom
// Only mock if Element is defined (jsdom environment)
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

vi.mock("src/api/data/utils/getContentPath");
