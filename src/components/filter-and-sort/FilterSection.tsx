import type { ReactNode } from "react";

import { useEffect, useRef } from "react";

type FilterSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
};

/**
 * Collapsible filter section wrapper using native details/summary.
 * - Prevents default toggle and manually controls open attribute for smooth animations
 * - Opening: height 0 → open=true → height scrollHeight
 * - Closing: height scrollHeight → is-closing class → height 0 → open=false on transitionend
 * - Uses direct DOM manipulation (classList, open attribute) to avoid React re-render conflicts
 * - Opacity transitions handled by CSS based on [open] and .is-closing states
 * @param props - Component props
 * @param props.children - Filter field content to render in details
 * @param props.defaultOpen - Whether section should be open by default (default: true)
 * @param props.title - Section title displayed in summary
 * @returns Collapsible filter section with accessible details/summary structure
 */
export function FilterSection({
  children,
  defaultOpen = true,
  title,
}: FilterSectionProps): React.JSX.Element {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionsEnabledRef = useRef<boolean | null>(null);

  // AIDEV-NOTE: Smooth height/opacity transitions
  // - Duration: 300ms with cubic-bezier(0.2,0.6,0.4,1)
  // - Height: JavaScript-measured scrollHeight (CSS can't transition height:auto)
  // - Opacity: CSS-based on [open] attribute and .is-closing class
  // - Uses direct DOM manipulation to avoid React controlled/uncontrolled conflicts
  useEffect(() => {
    const details = detailsRef.current;
    const content = contentRef.current;
    if (!details || !content) return;

    const summary = details.querySelector("summary");
    if (!summary) return;

    /**
     * Check if transitions are enabled
     * Lazy check on first click to ensure styles are computed
     */
    const checkTransitionsEnabled = (): boolean => {
      if (transitionsEnabledRef.current === null) {
        transitionsEnabledRef.current =
          globalThis.getComputedStyle(content).transitionDuration !== "0s";
      }
      return transitionsEnabledRef.current;
    };

    /**
     * Handles summary click - prevents default and manually controls open state
     */
    const handleClick = (evt: MouseEvent): void => {
      if (!checkTransitionsEnabled()) return; // Let native behavior work if no transitions

      evt.preventDefault();

      if (details.open) {
        closeDetails();
      } else {
        openDetails();
      }
    };

    /**
     * Opens the details element with animation
     */
    const openDetails = (): void => {
      // Set height to 0 before opening
      content.style.height = "0px";

      // Open the details element
      details.open = true;

      // Set height to scrollHeight to trigger transition
      // Use requestAnimationFrame to ensure browser has painted the open state
      requestAnimationFrame(() => {
        content.style.height = `${content.scrollHeight}px`;
      });
    };

    /**
     * Closes the details element with animation
     */
    const closeDetails = (): void => {
      // Set height to current scrollHeight first
      content.style.height = `${content.scrollHeight}px`;

      // Add is-closing class for styling during transition
      // AIDEV-NOTE: Using direct classList manipulation instead of React state
      // to avoid re-render conflicts with manual open attribute control
      details.classList.add("is-closing");

      // Animate to 0 after a slight delay
      setTimeout(() => {
        content.style.height = "0px";
      }, 1); // Minimal delay to ensure scrollHeight is applied
    };

    /**
     * Handles transition end - cleanup after closing animation
     */
    const handleTransitionEnd = (evt: TransitionEvent): void => {
      if (evt.target !== content) return;

      if (details.classList.contains("is-closing")) {
        details.classList.remove("is-closing");
        details.open = false;
      }

      // Remove inline height after transition (allows content to grow naturally when open)
      content.style.height = "";
    };

    // Set initial state (no animation on mount)
    details.open = defaultOpen;
    content.style.height = defaultOpen ? "" : "0px";

    summary.addEventListener("click", handleClick);
    content.addEventListener("transitionend", handleTransitionEnd);

    return (): void => {
      summary.removeEventListener("click", handleClick);
      content.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [defaultOpen]);

  return (
    <details
      className="
        group border-b border-default
        last:border-0
      "
      ref={detailsRef}
    >
      <summary
        className={`
          flex cursor-pointer items-center justify-between py-6 font-sans
          text-base font-semibold tracking-normal text-subtle
        `}
      >
        {/* Section title on left */}
        <span className="flex items-center gap-2">{title}</span>
        {/* Disclosure triangle on far right - points up when closed, rotates 180° to point down when open */}
        {/* AIDEV-NOTE: SVG points UP by default, then rotates 180° when details[open] to point DOWN */}
        <svg
          aria-hidden="true"
          className="
            ml-auto size-3 transition-transform duration-300
            group-open:rotate-180
          "
          fill="currentColor"
          viewBox="0 0 12 8"
        >
          {/* Path draws UP-pointing triangle (inverted from down-pointing) */}
          <path d="M12 6.5L10.5 8 6 3.5 1.5 8 0 6.5 6 0.5z" />
        </svg>
      </summary>
      {/* Panel: handles height transition  */}
      <div
        className="overflow-hidden"
        ref={contentRef}
        style={{
          transition: "height 300ms cubic-bezier(0.2, 0.6, 0.4, 1)",
        }}
      >
        {/* AIDEV-NOTE: Opacity transitions:
            - When open (not closing): opacity 1 with 0.1s delay (fade in after height starts)
            - When closing: opacity 0 with no delay (fade out immediately)
        */}
        <div
          className="
            px-px pt-px pb-6 opacity-0 transition-opacity duration-300
            [[open]:not(.is-closing)_&]:opacity-100
            [[open]:not(.is-closing)_&]:delay-100
          "
        >
          {children}
        </div>
      </div>
    </details>
  );
}
