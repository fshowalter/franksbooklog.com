class NavDrawer extends HTMLElement {
  private controller: AbortController | undefined;

  connectedCallback(): void {
    const navToggle = this.querySelector<HTMLButtonElement>(
      "[data-nav-drawer-toggle]",
    );
    const navClose = this.querySelector<HTMLButtonElement>(
      "[data-nav-close-trigger]",
    );
    const dialog = this.querySelector<HTMLDialogElement>("[data-nav-drawer]");

    if (!navToggle || !dialog) return;

    this.controller = new AbortController();
    const { signal } = this.controller;

    const open = () => {
      navToggle.setAttribute("aria-expanded", "true");
      dialog.showModal();
      requestAnimationFrame(() => {
        dialog.querySelector<HTMLAnchorElement>("a[href]")?.focus();
      });
    };

    const close = (returnFocus = false) => {
      navToggle.setAttribute("aria-expanded", "false");
      dialog.close();
      if (returnFocus) navToggle.focus();
    };

    navToggle.addEventListener("click", open, { signal });
    navClose?.addEventListener("click", () => close(true), { signal });

    // Escape key: native fires 'cancel'; prevent default to return focus manually
    dialog.addEventListener(
      "cancel",
      (e) => {
        e.preventDefault();
        close(true);
      },
      { signal },
    );

    // Nav link click: close the drawer
    dialog.addEventListener(
      "click",
      (e) => {
        if ((e.target as HTMLElement).tagName === "A") close();
      },
      { signal },
    );
  }

  disconnectedCallback(): void {
    this.controller?.abort();
  }
}

if (!customElements.get("nav-drawer")) {
  customElements.define("nav-drawer", NavDrawer);
}
