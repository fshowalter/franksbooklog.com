class NavDrawer extends HTMLElement {
  private escapeHandler: ((e: KeyboardEvent) => void) | undefined;
  private outsideClickHandler: ((e: MouseEvent) => void) | undefined;
  private tabHandler: ((e: KeyboardEvent) => void) | undefined;

  connectedCallback(): void {
    const body = document.body;
    const navToggle = this.querySelector<HTMLButtonElement>(
      "[data-nav-drawer-toggle]",
    );
    const navDrawer = this.querySelector<HTMLElement>("[data-nav-drawer]");
    const navBackdrop = this.querySelector<HTMLElement>(
      "[data-nav-drawer-backdrop]",
    );

    if (!navToggle || !navDrawer) return;

    // Toggle menu when hamburger button is clicked
    navToggle.addEventListener("click", () => {
      const isOpening = !body.classList.contains("nav-open");
      body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpening ? "true" : "false");

      // Focus first link when opening
      if (isOpening) {
        requestAnimationFrame(() => {
          navDrawer.querySelector<HTMLAnchorElement>("a[href]")?.focus();
        });
      }
    });

    // Helper function to close menu
    const closeMenu = (returnFocus = false) => {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      if (returnFocus) navToggle.focus();
    };

    // Close menu when clicking on a navigation link
    navDrawer.addEventListener("click", (e: Event) => {
      if ((e.target as HTMLElement).tagName === "A") closeMenu();
    });

    // Close menu when clicking backdrop
    navBackdrop?.addEventListener("click", () => closeMenu());

    // Close menu when clicking outside — stored for disconnectedCallback cleanup
    this.outsideClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        body.classList.contains("nav-open") &&
        !navDrawer.contains(target) &&
        !navToggle.contains(target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("click", this.outsideClickHandler);

    // Close menu on Escape key — stored for cleanup
    this.escapeHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        closeMenu(true);
      }
    };
    document.addEventListener("keydown", this.escapeHandler);

    // Trap focus within menu when open — stored for cleanup
    this.tabHandler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !body.classList.contains("nav-open")) return;

      const focusableElements = navDrawer.querySelectorAll<HTMLElement>(
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
    };
    document.addEventListener("keydown", this.tabHandler);
  }

  disconnectedCallback(): void {
    if (this.outsideClickHandler)
      document.removeEventListener("click", this.outsideClickHandler);
    if (this.escapeHandler)
      document.removeEventListener("keydown", this.escapeHandler);
    if (this.tabHandler)
      document.removeEventListener("keydown", this.tabHandler);
  }
}

if (!customElements.get("nav-drawer")) {
  customElements.define("nav-drawer", NavDrawer);
}
