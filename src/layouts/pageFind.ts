// @ts-expect-error no types for PagefindUI
import { PagefindUI } from "@pagefind/default-ui";

(() => {
  const openBtn = document.querySelector("button[data-open-modal]");
  if (!openBtn) return;
  if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
    openBtn.setAttribute("aria-keyshortcuts", "Meta+K");
    openBtn.setAttribute("title", `Search: ⌘K`);
  }
})();

const openBtn = document.querySelector<HTMLButtonElement>(
  "button[data-open-modal]",
)!;
const closeBtn = document.querySelector<HTMLButtonElement>(
  "button[data-close-modal]",
)!;
const dialog = document.querySelector("dialog")!;
const dialogFrame = document.querySelector("div[data-dialog-frame]")!;

// ios safari doesn't bubble click events unless a parent has a listener
document.body.addEventListener("click", () => {});

/** Close the modal if a user clicks on a link or outside of the modal. */
const onClick = (event: MouseEvent) => {
  const isLink = "href" in (event.target || {});
  if (
    isLink ||
    (document.body.contains(event.target as Node) &&
      !dialogFrame.contains(event.target as Node))
  ) {
    closeModal();
  }

  if (
    event.target instanceof HTMLButtonElement &&
    event.target.classList.contains("pagefind-ui__search-clear")
  ) {
    const input: HTMLElement = document.querySelector(
      ".pagefind-ui__search-input",
    )!;

    input.focus();
  }
};

const openModal = (event?: MouseEvent) => {
  dialog.showModal();
  document.body.toggleAttribute("data-search-modal-open", true);
  dialog.querySelector("input")?.focus();
  event?.stopPropagation();
  globalThis.addEventListener("click", onClick);
};

const closeModal = () => dialog.close();

openBtn.addEventListener("click", openModal);
openBtn.disabled = false;
closeBtn.addEventListener("click", closeModal);

dialog.addEventListener("close", () => {
  document.body.toggleAttribute("data-search-modal-open", false);
  globalThis.removeEventListener("click", onClick);
});

// Listen for `ctrl + k` and `cmd + k` keyboard shortcuts.
globalThis.addEventListener("keydown", (e: KeyboardEvent) => {
  if ((e.metaKey === true || e.ctrlKey === true) && e.key === "k") {
    if (dialog.open) closeModal();
    else {
      openModal();
    }
    e.preventDefault();
  }

  if (
    e.target instanceof HTMLInputElement &&
    e.target.classList.contains("pagefind-ui__search-input") &&
    e.key === "Enter"
  ) {
    e.target.blur();
  }
});

globalThis.addEventListener("DOMContentLoaded", () => {
  const onIdle = globalThis.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  onIdle(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new PagefindUI({
      baseUrl: import.meta.env.BASE_URL,
      bundlePath: import.meta.env.BASE_URL.replace(/\/$/, "") + "/pagefind/",
      element: "#pagefind__search",
      showImages: true,
      showSubResults: false,
    });
  });
});
