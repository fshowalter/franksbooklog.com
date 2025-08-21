import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { DOMWindow, JSDOM as JSDOMType } from "jsdom";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

// Mock the search-ui module to avoid Pagefind errors in tests
vi.mock("./search-ui");

describe("Layout navigation menu", () => {
  let dom: JSDOMType;
  let document: Document;
  let window: DOMWindow;
  let cleanup: () => void;

  beforeEach(async () => {
    // Render the test page using Astro's container API
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });

    // Import our test page that uses the Layout
    const TestPageModule = (await import("./TestPage.astro")) as {
      default: AstroComponentFactory;
    };
    const TestPage = TestPageModule.default;

    const result = await container.renderToString(TestPage, {
      partial: false,
      request: new Request(`https://www.franksmovielog.com/test`),
    });

    // Create JSDOM instance with the rendered HTML
    dom = new JSDOM(result, {
      pretendToBeVisual: true, // Provides requestAnimationFrame and other browser APIs
      runScripts: "dangerously", // Execute inline scripts
      url: "https://www.franksmovielog.com/test",
    });

    document = dom.window.document;
    window = dom.window;

    // Make JSDOM's window and document available globally for testing-library
    globalThis.window = window as unknown as typeof globalThis & Window;
    globalThis.document = document;
    // Navigator is read-only in Node, so we need to define it differently
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: window.navigator,
      writable: true,
    });

    // Set requestAnimationFrame globally before importing navMenu
    globalThis.requestAnimationFrame = window.requestAnimationFrame;

    // Mock requestIdleCallback for customSearch
    globalThis.requestIdleCallback =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) => setTimeout(cb, 1));

    // Set up globalThis.addEventListener for customSearch
    globalThis.addEventListener = window.addEventListener.bind(window);
    globalThis.removeEventListener = window.removeEventListener.bind(window);

    // Add HTMLInputElement to global scope for customSearch
    globalThis.HTMLInputElement = window.HTMLInputElement;
    globalThis.HTMLButtonElement = window.HTMLButtonElement;

    // Mock import.meta.env for customSearch
    vi.stubGlobal("import.meta.env", {
      BASE_URL: "/",
    });

    // Mock dialog methods since JSDOM doesn't fully support them
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal = vi.fn().mockImplementation(function (
        this: HTMLDialogElement,
      ) {
        this.open = true;
      });
      dialog.close = vi.fn().mockImplementation(function (
        this: HTMLDialogElement,
      ) {
        this.open = false;
        this.dispatchEvent(new window.Event("close"));
      });
    }

    // Import the init functions directly
    // This ensures Vitest instruments them for coverage
    const { initNavMenu } = await import("./navMenu.ts");
    const { initSearch } = await import("./search.ts");

    // Call the functions in the JSDOM context
    // The imports will execute the module's top-level code which auto-initializes
    // But we need to manually call them since JSDOM's document.readyState might not trigger them
    initNavMenu();
    initSearch();

    cleanup = () => {
      // Clean up body classes
      if (document?.body) {
        document.body.classList.remove("nav-open");
      }
    };
  });

  afterEach(() => {
    cleanup();
    window.close();
    vi.clearAllMocks();
  });

  it("renders navigation toggle button", ({ expect }) => {
    const toggleButton = document.querySelector("[data-nav-toggle]");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton?.getAttribute("aria-label")).toBe(
      "Toggle navigation menu",
    );
    expect(toggleButton?.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders navigation menu", ({ expect }) => {
    const navMenu = document.querySelector("[data-nav-menu]");
    expect(navMenu).toBeTruthy();
    // The aria-label is on the parent nav element, not the ul with data-nav-menu
    const navElement = navMenu?.closest("nav");
    expect(navElement?.getAttribute("aria-label")).toBe("Main navigation");
  });

  it("opens and closes navigation menu on toggle button click", ({
    expect,
  }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const body = document.body;

    // Initially closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");

    // Close menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking a navigation link", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Click a navigation link
    const navLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(navLink).toBeTruthy();
    navLink.click();

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking backdrop", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const backdrop = document.querySelector(
      "[data-nav-backdrop]",
    ) as HTMLElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Click backdrop
    backdrop.click();

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking outside", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Create a click event on the body but outside the menu
    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    // Find an element that's outside the nav menu and toggle button
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.dispatchEvent(clickEvent);
    } else {
      body.dispatchEvent(clickEvent);
    }

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu on Escape key", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Press Escape
    const event = new window.KeyboardEvent("keydown", {
      bubbles: true,
      key: "Escape",
    });
    document.dispatchEvent(event);

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("focuses first link when opening menu", async ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Wait for next frame (requestAnimationFrame)
    await new Promise((resolve) => window.requestAnimationFrame(resolve));

    // First link should be focused
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(document.activeElement).toBe(firstLink);
  });

  it("returns focus to toggle button on Escape", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;

    // Open menu
    toggleButton.click();
    expect(document.body.classList.contains("nav-open")).toBe(true);

    // Move focus elsewhere first
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    firstLink.focus();

    // Press Escape
    const event = new window.KeyboardEvent("keydown", {
      bubbles: true,
      key: "Escape",
    });
    document.dispatchEvent(event);

    // Toggle button should be focused
    expect(document.activeElement).toBe(toggleButton);
  });

  it("traps focus within menu when open - Tab from toggle button", ({
    expect,
  }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Focus is on toggle button
    toggleButton.focus();
    expect(document.activeElement).toBe(toggleButton);

    // Simulate Tab key - the handler should prevent default and move focus
    const tabEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Tab",
    });

    // The event handler will prevent default and move focus
    const defaultPrevented = !document.dispatchEvent(tabEvent);

    // Check that default was prevented
    expect(defaultPrevented).toBe(true);

    // First menu item should be focused
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(document.activeElement).toBe(firstLink);
  });

  it("traps focus within menu when open - Shift+Tab from first element", ({
    expect,
  }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Focus first link
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);

    // Simulate Shift+Tab
    const shiftTabEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Tab",
      shiftKey: true,
    });

    // The event handler will prevent default and move focus
    const defaultPrevented = !document.dispatchEvent(shiftTabEvent);

    // Check that default was prevented
    expect(defaultPrevented).toBe(true);

    // Toggle button should be focused
    expect(document.activeElement).toBe(toggleButton);
  });
});

describe("Layout search modal (customSearch)", () => {
  let dom: JSDOMType;
  let document: Document;
  let window: DOMWindow;
  let cleanup: () => void;

  beforeEach(async () => {
    // Render the test page using Astro's container API
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });

    // Import our test page that uses the Layout
    const TestPageModule = (await import("./TestPage.astro")) as {
      default: AstroComponentFactory;
    };
    const TestPage = TestPageModule.default;

    const result = await container.renderToString(TestPage, {
      partial: false,
      request: new Request(`https://www.franksmovielog.com/test`),
    });

    // Create JSDOM instance with the rendered HTML
    dom = new JSDOM(result, {
      pretendToBeVisual: true,
      runScripts: "dangerously",
      url: "https://www.franksmovielog.com/test",
    });

    document = dom.window.document;
    window = dom.window;

    // Make JSDOM's window and document available globally
    globalThis.window = window as unknown as typeof globalThis & Window;
    globalThis.document = document;
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: window.navigator,
      writable: true,
    });

    // Set up mocks
    globalThis.requestAnimationFrame = window.requestAnimationFrame;
    globalThis.requestIdleCallback =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) => setTimeout(cb, 1));

    // Set up globalThis event listeners
    globalThis.addEventListener = window.addEventListener.bind(window);
    globalThis.removeEventListener = window.removeEventListener.bind(window);
    globalThis.dispatchEvent = window.dispatchEvent.bind(window);

    // Add HTMLInputElement to global scope for customSearch
    globalThis.HTMLInputElement = window.HTMLInputElement;
    globalThis.HTMLButtonElement = window.HTMLButtonElement;

    vi.stubGlobal("import.meta.env", {
      BASE_URL: "/",
    });

    // Mock dialog methods
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal = vi.fn().mockImplementation(function (
        this: HTMLDialogElement,
      ) {
        this.open = true;
      });
      dialog.close = vi.fn().mockImplementation(function (
        this: HTMLDialogElement,
      ) {
        this.open = false;
        this.dispatchEvent(new window.Event("close"));
      });
    }

    // Import and initialize pageFind
    const { initPageFind } = await import("./search.ts");
    initPageFind();

    cleanup = () => {
      delete document.body.dataset.searchModalOpen;
      const dialog = document.querySelector("dialog");
      if (dialog) {
        dialog.open = false;
      }
    };
  });

  afterEach(() => {
    cleanup();
    window.close();
    vi.clearAllMocks();
  });

  it("renders search button", ({ expect }) => {
    const openBtn = document.querySelector("[data-open-modal]");
    expect(openBtn).toBeTruthy();
  });

  it("renders close button", ({ expect }) => {
    const closeBtn = document.querySelector("[data-close-modal]");
    expect(closeBtn).toBeTruthy();
  });

  it("renders dialog element", ({ expect }) => {
    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
  });

  it("enables search button after initialization", ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    expect(openBtn?.disabled).toBe(false);
  });

  it("sets Mac keyboard shortcut for Mac users", async ({ expect }) => {
    // Re-initialize with Mac user agent
    const originalUserAgent = Object.getOwnPropertyDescriptor(
      window.navigator,
      "userAgent",
    );
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    });

    // Re-import and initialize
    vi.resetModules();
    const { initPageFind } = await import("./search.ts");
    initPageFind();

    const openBtn = document.querySelector("[data-open-modal]");
    expect(openBtn?.getAttribute("aria-keyshortcuts")).toBe("Meta+K");
    expect(openBtn?.getAttribute("title")).toBe("Search: ⌘K");

    // Restore original user agent
    if (originalUserAgent) {
      Object.defineProperty(window.navigator, "userAgent", originalUserAgent);
    }
  });

  it("opens modal when search button is clicked", ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    openBtn?.click();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.showModal).toHaveBeenCalled();
    expect(Object.hasOwn(document.body.dataset, "searchModalOpen")).toBe(true);
  });

  it("closes modal when close button is clicked", ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const closeBtn =
      document.querySelector<HTMLButtonElement>("[data-close-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    // First open the modal
    openBtn?.click();
    expect(dialog?.open).toBe(true);

    // Then close it
    closeBtn?.click();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.close).toHaveBeenCalled();
  });

  it("closes modal when clicking outside dialog frame", async ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    // Open the modal
    openBtn?.click();
    expect(dialog?.open).toBe(true);

    // Wait for async operations to complete (openModal is async now)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Click outside the dialog frame (on body)
    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(clickEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.close).toHaveBeenCalled();
  });

  it("does not close modal when clicking inside dialog frame", ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");
    const dialogFrame = document.querySelector("[data-dialog-frame]");

    // Open the modal
    openBtn?.click();
    expect(dialog?.open).toBe(true);

    // Click inside the dialog frame
    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    dialogFrame?.dispatchEvent(clickEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.close).not.toHaveBeenCalled();
    expect(dialog?.open).toBe(true);
  });

  it("opens modal with Cmd+K keyboard shortcut", ({ expect }) => {
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    const keyEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      key: "k",
      metaKey: true,
    });
    globalThis.dispatchEvent(keyEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.showModal).toHaveBeenCalled();
  });

  it("opens modal with Ctrl+K keyboard shortcut", ({ expect }) => {
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    const keyEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      ctrlKey: true,
      key: "k",
    });
    globalThis.dispatchEvent(keyEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.showModal).toHaveBeenCalled();
  });

  it("closes modal with Cmd+K when already open", ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    // Open the modal first
    openBtn?.click();
    expect(dialog?.open).toBe(true);

    // Press Cmd+K to close
    const keyEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      key: "k",
      metaKey: true,
    });
    globalThis.dispatchEvent(keyEvent);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.close).toHaveBeenCalled();
  });

  it("removes data-search-modal-open attribute when dialog closes", ({
    expect,
  }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    // Open the modal
    openBtn?.click();
    expect(Object.hasOwn(document.body.dataset, "searchModalOpen")).toBe(true);

    // Trigger the close event (the mock close() already dispatches it)
    dialog?.close();

    expect(Object.hasOwn(document.body.dataset, "searchModalOpen")).toBe(false);
  });

  it("closes modal when clicking on a link", async ({ expect }) => {
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    const dialog = document.querySelector<HTMLDialogElement>("dialog");

    // Open the modal
    openBtn?.click();
    expect(dialog?.open).toBe(true);

    // Create and click a link
    const link = document.createElement("a");
    link.href = "/test";
    document.body.append(link);

    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, "target", {
      value: link,
      writable: false,
    });
    globalThis.dispatchEvent(clickEvent);

    // Wait for the 100ms delay before modal closes
    await new Promise((resolve) => setTimeout(resolve, 110));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(dialog?.close).toHaveBeenCalled();
  });

  it("blurs search input when Enter is pressed", ({ expect }) => {
    // Use the actual input element from the rendered layout
    const input = document.querySelector<HTMLInputElement>(
      "#pagefind-search-input",
    );
    expect(input).toBeTruthy();

    const blurSpy = vi.spyOn(input!, "blur");
    input!.focus();

    const keyEvent = new window.KeyboardEvent("keydown", {
      bubbles: true,
      key: "Enter",
    });
    Object.defineProperty(keyEvent, "target", {
      value: input,
      writable: false,
    });
    globalThis.dispatchEvent(keyEvent);

    expect(blurSpy).toHaveBeenCalled();
  });

  it("focuses search input when clear button is clicked", ({ expect }) => {
    // Use the actual elements from the rendered layout
    const clearBtn = document.querySelector<HTMLButtonElement>(
      "#pagefind-clear-button",
    );
    const searchInput = document.querySelector<HTMLInputElement>(
      "#pagefind-search-input",
    );

    expect(clearBtn).toBeTruthy();
    expect(searchInput).toBeTruthy();

    const focusSpy = vi.spyOn(searchInput!, "focus");

    // Open modal first to set up click listener
    const openBtn =
      document.querySelector<HTMLButtonElement>("[data-open-modal]");
    openBtn?.click();

    // Click the clear button
    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, "target", {
      value: clearBtn,
      writable: false,
    });
    globalThis.dispatchEvent(clickEvent);

    expect(focusSpy).toHaveBeenCalled();
  });
});
