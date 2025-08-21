/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchUI } from "./search-ui";

// Mock the debounce utility
vi.mock("~/utils/debounce", () => ({
  debounce: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

function createMockResult(id: string) {
  return {
    data: vi.fn().mockResolvedValue({
      excerpt: `Excerpt ${id}`,
      filters: {},
      meta: { title: `Result ${id}` },
      url: `/result${id}`,
      weighted_locations: [],
    }),
    id,
    score: 1,
    words: [1],
  };
}

// Helper functions for creating mock results
function createMockResultWithTitle(id: string, title: string) {
  return {
    data: vi.fn().mockResolvedValue({
      excerpt: `Excerpt ${id}`,
      filters: {},
      meta: { title },
      url: `/result${id}`,
      weighted_locations: [],
    }),
    id,
    score: 1,
    words: [1],
  };
}

describe("SearchUI", () => {
  let searchUI: SearchUI;
  let container: HTMLElement;
  let input: HTMLInputElement;
  let clearButton: HTMLButtonElement;
  let resultsContainer: HTMLElement;
  let resultsCounter: HTMLElement;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  // Mock pagefind API
  const mockPagefindAPI = {
    debouncedSearch: vi.fn(),
    destroy: vi.fn(() => Promise.resolve()),
    filters: vi.fn().mockResolvedValue({}),
    init: vi.fn(() => Promise.resolve()),
    options: vi.fn(() => Promise.resolve()),
    preload: vi.fn(() => Promise.resolve()),
    search: vi.fn(),
  };

  beforeEach(() => {
    // Set up DOM structure
    document.body.innerHTML = `
      <div id="pagefind__search">
        <input class="pagefind-ui__search-input" type="text" />
        <button class="pagefind-ui__search-clear hidden">Clear</button>
        <div class="pagefind-ui__results-count"></div>
        <div class="pagefind-ui__results"></div>
        <div class="pagefind-ui__results-footer hidden">
          <button class="pagefind-ui__button">Load More</button>
        </div>
        <div class="pagefind-ui__filters"></div>
      </div>
    `;

    container = document.querySelector("#pagefind__search") as HTMLElement;
    input = container.querySelector(
      ".pagefind-ui__search-input",
    ) as HTMLInputElement;
    clearButton = container.querySelector(
      ".pagefind-ui__search-clear",
    ) as HTMLButtonElement;
    resultsContainer = container.querySelector(
      ".pagefind-ui__results",
    ) as HTMLElement;
    resultsCounter = container.querySelector(
      ".pagefind-ui__results-count",
    ) as HTMLElement;

    // Reset mocks
    vi.clearAllMocks();

    // Mock console.error to suppress expected error logs
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // Explicitly do nothing - suppress output
    });

    // Set up default mock return values
    mockPagefindAPI.search.mockResolvedValue({
      filters: {},
      results: [],
      timings: { preload: 0, search: 0, total: 0 },
      totalFilters: {},
      unfilteredResultCount: 0,
    });

    mockPagefindAPI.debouncedSearch.mockResolvedValue({
      filters: {},
      results: [],
      timings: { preload: 0, search: 0, total: 0 },
      totalFilters: {},
      unfilteredResultCount: 0,
    });

    // Mock dynamic import for pagefind
    vi.doMock("/pagefind/pagefind.js", () => mockPagefindAPI);

    searchUI = new SearchUI();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
    vi.doUnmock("/pagefind/pagefind.js");
  });

  describe("initialization", () => {
    it("should handle missing DOM elements gracefully", async () => {
      document.body.innerHTML = "";
      const newSearchUI = new SearchUI();

      // Should not throw when elements are missing
      await expect(newSearchUI.init()).resolves.toBeUndefined();
    });

    it("should initialize with fallback element selectors", async () => {
      // Set up alternative DOM structure (without container)
      document.body.innerHTML = `
        <input id="pagefind-search-input" type="text" />
        <button id="pagefind-clear-button" class="hidden">Clear</button>
        <div id="pagefind-results-counter"></div>
        <div id="pagefind-results"></div>
        <div id="pagefind-load-more-wrapper" class="hidden">
          <button id="pagefind-load-more">Load More</button>
        </div>
      `;

      const newSearchUI = new SearchUI();
      await newSearchUI.init();

      const fallbackInput = document.querySelector(
        "#pagefind-search-input",
      ) as HTMLInputElement;
      expect(fallbackInput).toBeTruthy();
    });
  });

  describe("search functionality", () => {
    it("should clear search when clear button is clicked", async () => {
      await searchUI.init();

      // First set some input
      input.value = "test";
      input.dispatchEvent(new Event("input"));

      expect(clearButton.classList.contains("hidden")).toBe(false);

      // Click clear button
      clearButton.click();

      expect(input.value).toBe("");
      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(resultsContainer.innerHTML).toBe("");
      expect(resultsCounter.textContent).toBe("");
    });

    it("should clear search when input is emptied", async () => {
      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      input.value = "";
      input.dispatchEvent(new Event("input"));

      expect(clearButton.classList.contains("hidden")).toBe(true);
      expect(resultsContainer.innerHTML).toBe("");
    });

    it("should cancel pending search when new search starts", async () => {
      await searchUI.init();

      const abortSpy = vi.spyOn(AbortController.prototype, "abort");

      // Start first search
      input.value = "first";
      input.dispatchEvent(new Event("input"));

      // Start second search before first completes
      input.value = "second";
      input.dispatchEvent(new Event("input"));

      expect(abortSpy).toHaveBeenCalled();
      abortSpy.mockRestore();
    });
  });

  describe("destroy functionality", () => {
    it("should abort pending searches when destroyed", async () => {
      // Initialize first to set up abort controller
      await searchUI.init();

      const abortSpy = vi.spyOn(AbortController.prototype, "abort");

      // Start a search
      input.value = "test";
      input.dispatchEvent(new Event("input"));

      // Wait a tick for the search to start
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Destroy before search completes
      await searchUI.destroy();

      expect(abortSpy).toHaveBeenCalled();
      abortSpy.mockRestore();
    });
  });

  describe("rendering", () => {
    it("should trim search query", async () => {
      await searchUI.init();

      // Input with whitespace
      input.value = "  ";
      input.dispatchEvent(new Event("input"));

      // Should clear for whitespace-only input
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(resultsContainer.innerHTML).toBe("");
    });

    it("should show/hide clear button based on input", async () => {
      await searchUI.init();

      // Initially hidden
      expect(clearButton.classList.contains("hidden")).toBe(true);

      // Show when input has value
      input.value = "test";
      input.dispatchEvent(new Event("input"));
      expect(clearButton.classList.contains("hidden")).toBe(false);

      // Hide when input is cleared
      input.value = "";
      input.dispatchEvent(new Event("input"));
      expect(clearButton.classList.contains("hidden")).toBe(true);
    });
  });

  describe("search results", () => {
    it("should handle search results with data", async () => {
      const mockResults = [
        {
          data: vi.fn().mockResolvedValue({
            excerpt: "Test excerpt 1",
            filters: {},
            meta: { title: "Test Title 1" },
            url: "/test1",
            weighted_locations: [],
          }),
          id: "1",
          score: 1,
          words: [1],
        },
        {
          data: vi.fn().mockResolvedValue({
            excerpt: "Test excerpt 2",
            filters: {},
            meta: { title: "Test Title 2" },
            url: "/test2",
            weighted_locations: [],
          }),
          id: "2",
          score: 0.9,
          words: [1],
        },
      ];

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 2,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsContainer.innerHTML).toContain("Test Title 1");
      expect(resultsContainer.innerHTML).toContain("Test excerpt 1");
      expect(resultsContainer.innerHTML).toContain("/test1");
      expect(resultsCounter.textContent).toContain("2 results");
      expect(resultsCounter.textContent).toContain("test");
    });

    it("should render results with images when available", async () => {
      const mockResults = [
        {
          data: vi.fn().mockResolvedValue({
            excerpt: "Test excerpt",
            filters: {},
            meta: {
              image: "/test-image.jpg",
              image_alt: "Test alt text",
              title: "Test Title",
            },
            url: "/test",
            weighted_locations: [],
          }),
          id: "1",
          score: 1,
          words: [1],
        },
      ];

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 1,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsContainer.innerHTML).toContain('src="/test-image.jpg"');
      expect(resultsContainer.innerHTML).toContain('alt="Test alt text"');
    });

    it("should show correct message for zero results", async () => {
      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: [],
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 0,
      });

      await searchUI.init();

      input.value = "notfound";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsCounter.textContent).toBe('No results for "notfound"');
      expect(resultsContainer.innerHTML).toContain(
        "No results found. Try adjusting your search terms.",
      );
    });

    it("should show correct message for single result", async () => {
      const mockResults = [
        {
          data: vi.fn().mockResolvedValue({
            excerpt: "Test",
            filters: {},
            meta: { title: "Single Result" },
            url: "/single",
            weighted_locations: [],
          }),
          id: "1",
          score: 1,
          words: [1],
        },
      ];

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 1,
      });

      await searchUI.init();

      input.value = "single";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsCounter.textContent).toBe('1 result for "single"');
    });
  });

  describe("load more functionality", () => {
    it("should load more results when button is clicked", async () => {
      const mockResults = Array.from({ length: 10 }, (_, i) =>
        createMockResultWithTitle(`${i + 1}`, `Result ${i + 1}`),
      );

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 10,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const loadMoreWrapper = container.querySelector(
        ".pagefind-ui__results-footer",
      ) as HTMLElement;
      const loadMoreButton = container.querySelector(
        ".pagefind-ui__button",
      ) as HTMLButtonElement;

      expect(loadMoreWrapper.classList.contains("hidden")).toBe(false);
      expect(loadMoreButton.textContent).toContain("Load 5 more");
      expect(loadMoreButton.textContent).toContain("5 total");

      expect(resultsContainer.innerHTML).toContain("Result 1");
      expect(resultsContainer.innerHTML).toContain("Result 5");
      expect(resultsContainer.innerHTML).not.toContain("Result 6");

      loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsContainer.innerHTML).toContain("Result 6");
      expect(resultsContainer.innerHTML).toContain("Result 10");
      expect(loadMoreWrapper.classList.contains("hidden")).toBe(true);
    });

    it("should handle load more errors gracefully", async () => {
      const createMockResult = (id: string, shouldFail = false) => ({
        data: shouldFail
          ? vi.fn().mockRejectedValue(new Error("Failed to load"))
          : vi.fn().mockResolvedValue({
              excerpt: `Excerpt ${id}`,
              filters: {},
              meta: { title: `Result ${id}` },
              url: `/result${id}`,
              weighted_locations: [],
            }),
        id,
        score: 1,
        words: [1],
      });

      const mockResults = [
        ...Array.from({ length: 5 }, (_, i) =>
          createMockResult(`${i + 1}`, false),
        ),
        ...Array.from({ length: 5 }, (_, i) =>
          createMockResult(`${i + 6}`, true),
        ),
      ];

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 10,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const loadMoreButton = container.querySelector(
        ".pagefind-ui__button",
      ) as HTMLButtonElement;

      // Clear any previous console.error calls
      consoleErrorSpy.mockClear();

      loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load more results:",
        expect.any(Error),
      );
      expect(resultsContainer.innerHTML).toContain(
        "Failed to load more results.",
      );
    });

    it("should create screen reader announcements when loading more", async () => {
      const mockResults = Array.from({ length: 10 }, (_, i) =>
        createMockResult(`${i + 1}`),
      );

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 10,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      const loadMoreButton = container.querySelector(
        ".pagefind-ui__button",
      ) as HTMLButtonElement;

      loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toBeTruthy();
      expect(announcement?.getAttribute("aria-live")).toBe("polite");
      expect(announcement?.classList.contains("sr-only")).toBe(true);
      expect(announcement?.textContent).toContain("5 more results loaded");

      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(document.querySelector('[role="status"]')).toBeFalsy();
    });
  });

  describe("error handling", () => {
    it("should handle initialization errors", async () => {
      // Override the mock to simulate a broken pagefind module
      vi.doUnmock("/pagefind/pagefind.js");
      vi.doMock("/pagefind/pagefind.js", () => ({
        // Return an object without the required 'options' method
        // This will cause an error when trying to call pagefindModule.options
        init: vi.fn(),
        search: vi.fn(),
      }));

      const errorSearchUI = new SearchUI();
      await errorSearchUI.init();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to initialize search API:",
        expect.any(Error),
      );

      // Restore the mock for other tests
      vi.doUnmock("/pagefind/pagefind.js");
      vi.doMock("/pagefind/pagefind.js", () => mockPagefindAPI);
    });

    it("should handle search errors gracefully", async () => {
      mockPagefindAPI.debouncedSearch.mockRejectedValueOnce(
        new Error("Network error"),
      );

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Search failed:",
        expect.any(Error),
      );
      expect(resultsContainer.innerHTML).toContain(
        "Search failed. Please try again.",
      );
    });

    it("should ignore aborted search errors", async () => {
      await searchUI.init();

      // Clear any previous calls to console.error
      consoleErrorSpy.mockClear();

      // Set up the mock to reject with an AbortError
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      mockPagefindAPI.debouncedSearch.mockRejectedValueOnce(abortError);

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(resultsContainer.innerHTML).not.toContain("Search failed");
    });

    it("should show loading skeleton while searching", async () => {
      let resolveSearch: (value: unknown) => void;
      const searchPromise = new Promise((resolve) => {
        resolveSearch = resolve;
      });

      mockPagefindAPI.debouncedSearch.mockReturnValueOnce(searchPromise);

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(resultsContainer.innerHTML).toContain("animate-pulse");
      expect(resultsContainer.innerHTML).toContain("bg-subtle");

      resolveSearch!({
        filters: {},
        results: [],
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 0,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsContainer.innerHTML).not.toContain("animate-pulse");
    });
  });

  describe("edge cases", () => {
    it("should not reinitialize when already initialized", async () => {
      await searchUI.init();

      // Clear the mock call count after first init
      mockPagefindAPI.init.mockClear();

      await searchUI.init();

      // Should not call init again
      expect(mockPagefindAPI.init).not.toHaveBeenCalled();
    });

    it("should focus input when clear button is clicked", async () => {
      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      const focusSpy = vi.spyOn(input, "focus");

      clearButton.click();

      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it("should maintain scroll position when loading more results", async () => {
      const mockResults = Array.from({ length: 10 }, (_, i) =>
        createMockResult(`${i + 1}`),
      );

      mockPagefindAPI.debouncedSearch.mockResolvedValueOnce({
        filters: {},
        results: mockResults,
        timings: { preload: 0, search: 0, total: 0 },
        totalFilters: {},
        unfilteredResultCount: 10,
      });

      await searchUI.init();

      input.value = "test";
      input.dispatchEvent(new Event("input"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      resultsContainer.scrollTop = 100;

      const loadMoreButton = container.querySelector(
        ".pagefind-ui__button",
      ) as HTMLButtonElement;

      loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(resultsContainer.scrollTop).toBe(100);
    });

    it("should properly clean up on destroy", async () => {
      await searchUI.init();

      // Start a search but don't wait for it to complete
      input.value = "test";
      input.dispatchEvent(new Event("input"));

      // Immediately destroy while search is pending
      await searchUI.destroy();

      expect(mockPagefindAPI.destroy).toHaveBeenCalled();
      // The destroy method clears internal state but doesn't update DOM
      // This is acceptable as destroy is meant to clean up resources
    });
  });
});
