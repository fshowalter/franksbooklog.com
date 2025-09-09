/**
 * Initializes the responsive navigation menu with accessibility features.
 * Handles toggle functionality, focus management, keyboard navigation,
 * and click-outside behavior for mobile navigation.
 */
export function initNavMenu(): void {
  const body = document.body;
  const navToggle =
    document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const navMenu = document.querySelector<HTMLElement>("[data-nav-menu]");
  const navBackdrop = document.querySelector<HTMLElement>(
    "[data-nav-backdrop]",
  );

  if (!navToggle || !navMenu) {
    return;
  }

  // Toggle menu when hamburger button is clicked
  navToggle.addEventListener("click", () => {
    const isOpening = !body.classList.contains("nav-open");
    body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpening ? "true" : "false");

    // Focus first link when opening
    if (isOpening) {
      requestAnimationFrame(() => {
        const firstLink = navMenu.querySelector<HTMLAnchorElement>("a[href]");
        firstLink?.focus();
      });
    }
  });

  // Helper function to close menu
  const closeMenu = (returnFocus = false) => {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) {
      navToggle.focus();
    }
  };

  // Close menu when clicking on a navigation link
  navMenu.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
      closeMenu();
    }
  });

  // Close menu when clicking backdrop
  navBackdrop?.addEventListener("click", () => {
    closeMenu();
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      body.classList.contains("nav-open") &&
      !navMenu.contains(target) &&
      !navToggle.contains(target)
    ) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      closeMenu(true);
    }
  });

  // Trap focus within menu when open
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !body.classList.contains("nav-open")) {
      return;
    }

    const focusableElements = navMenu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.item(-1);

    // If focus is on the toggle button, move to first menu item
    if (document.activeElement === navToggle) {
      if (!e.shiftKey) {
        e.preventDefault();
        firstElement.focus();
      }
      return;
    }

    // If shift+tab on first element, move to toggle button
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      navToggle.focus();
    }
    // If tab on last element, move to toggle button
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      navToggle.focus();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavMenu);
} else {
  initNavMenu();
}
