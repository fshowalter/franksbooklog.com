import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Set up vitest-fail-on-console to catch unexpected console.error and console.warn.
// Allow the Astro "collection does not exist or is empty" warning — this is expected
// in the AstroContainer test environment where content loaders don't run.
failOnConsole({
  allowMessage: (message: string) =>
    message.includes("does not exist or is empty"),
});

// Mock scrollIntoView which is not available in jsdom
// Only mock if Element is defined (jsdom environment)
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

vi.mock("src/api/data/utils/getContentPath");
