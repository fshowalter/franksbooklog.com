import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

failOnConsole();

// Mock scrollIntoView which is not available in jsdom
// Only mock if Element is defined (jsdom environment)
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

// Mock HTMLDialogElement methods not implemented in jsdom.
// showModal sets the open attribute; close removes it and dispatches the close
// event so that components listening to the native close event work in tests.
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
}
