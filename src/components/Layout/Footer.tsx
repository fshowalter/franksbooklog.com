import type { JSX } from "react";

import { Logo } from "./Logo";
import { TableOfContents } from "./TableOfContents";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto max-w-(--breakpoint-laptop) px-container py-20">
        <div
          className={`
            flex w-full flex-col
            tablet:flex-row-reverse tablet:justify-between
          `}
        >
          <a
            className={`
              mx-auto mb-8 w-full max-w-button transform-gpu rounded-md
              bg-subtle py-5 text-center font-sans text-sm font-normal
              tracking-wide text-default uppercase transition-all
              hover:scale-105 hover:bg-default hover:text-default
              hover:drop-shadow-lg
              tablet:mx-0
            `}
            href="#top"
          >
            To the top
          </a>
          <Logo />
        </div>
        <div
          className={`
            justify-between
            tablet:flex
          `}
        >
          <div
            className={`
              flex max-w-[640px] flex-col pb-12
              tablet:pr-32
            `}
          >
            <div className={`pt-10 font-sans font-normal text-subtle`}>
              <p
                className={`
                  mb-6 text-pretty
                  first-letter:float-left first-letter:mt-[6px]
                  first-letter:pr-1 first-letter:font-sans
                  first-letter:text-[40px] first-letter:leading-[.8]
                  first-letter:font-bold first-letter:text-default
                  desktop:first-letter:text-[64px]
                `}
              >
                Hi there, I&apos;m Frank, a husband and father old enough to
                have read Stephen King&apos;s <em>The Dark Half</em> during its
                first printing.
              </p>

              <p className="mb-6 text-pretty">
                This site began in 2012, when I realized I&apos;d accumulated
                more books than I could ever hope to finish. Worse still, I had
                books I thought I&apos;d read but couldn&apos;t remember.
                Clearly, I needed a system.
              </p>

              <p className="mb-6 text-pretty">
                What started on Goodreads evolved into this little corner of the
                internet where I share my thoughts on what I&apos;ve read.
              </p>

              <p className="mb-6 text-pretty">
                New visitors might want to start by reading about{" "}
                <FooterLink href="/how-i-grade/" text="how I grade" />. After
                that, feel free to browse{" "}
                <FooterLink href="/reviews/" text="my reviews" />, which are
                also indexed <FooterLink href="/authors/" text="by author" />.
              </p>

              <p className="mb-6 text-pretty">
                I also keep a{" "}
                <FooterLink href="/readings/" text="reading log" /> that tracks
                everything I read, whether it gets a full review or not,
                complete with{" "}
                <FooterLink href="/readings/stats/" text="stats" />. In an age
                of endless content, sometimes the act of remembering what
                we&apos;ve read becomes as important as the reading itself.
              </p>

              <p className="text-pretty">
                In an era of algorithmic recommendations and corporate marketing
                machines, consider this site a human alternative—one
                person&apos;s attempt to catalog his personal library and maybe
                help a few fellow travelers along the way.
              </p>
            </div>
          </div>
          <div
            className={`
              flex w-full max-w-button grow flex-col gap-20 pt-10 pb-20
              tablet:basis-button tablet:pr-10
            `}
          >
            <TableOfContents className={`desktop:w-auto`} />
          </div>
        </div>
      </div>
      <p
        className={`
          w-full bg-footer px-container py-10 text-center leading-5 font-normal
          text-inverse
        `}
      >
        All reviews by Frank Showalter. All images used in accordance with the{" "}
        <a
          className={`
            relative inline-block pr-4 text-inherit underline underline-offset-3
            hover:bg-default hover:text-accent
          `}
          href="http://www.copyright.gov/title17/92chap1.html#107"
          rel="nofollow"
        >
          Fair Use Law
          <svg
            className="absolute top-0.5 right-0 size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        .
      </p>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <a
      className={`
        underline transition-colors
        hover:text-accent
      `}
      href={href}
    >
      {text}
    </a>
  );
}
