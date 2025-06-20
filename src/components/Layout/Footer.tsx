import type { JSX } from "react";

import type { NavItem } from "./navItems";

import { Logo } from "./Logo";
import { navItems } from "./navItems";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto max-w-(--breakpoint-desktop) px-container py-20">
        <div
          className={`
            flex w-full flex-col
            tablet:flex-row-reverse tablet:justify-between
          `}
        >
          <a
            className={`
              mx-auto mb-8 w-full max-w-button bg-footer py-5 text-center
              font-sans text-xs tracking-wide text-inverse uppercase
              hover:bg-subtle hover:text-default
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
              flex max-w-prose flex-col pb-12
              tablet:pr-32
            `}
          >
            <div className={`pt-10 font-sans text-base font-light text-subtle`}>
              <p className="mb-6 text-pretty">
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
                that, feel free to browse my{" "}
                <FooterLink href="/reviews/" text="reviews" />, which are also
                indexed <FooterLink href="/authors/" text="by author" />.
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
              flex grow-0 flex-col gap-20 pt-10 pb-20
              tablet:basis-button tablet:pr-10
            `}
          >
            <ul
              className={`
                flex w-full flex-col gap-y-10
                max:w-auto
              `}
            >
              {navItems.map((item) => {
                return <NavListItem key={item.target} value={item} />;
              })}
            </ul>
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
            text-inherit underline decoration-dashed underline-offset-4
            hover:bg-default hover:text-default
          `}
          href="http://www.copyright.gov/title17/92chap1.html#107"
          rel="nofollow"
        >
          Fair Use Law
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
        text-default underline decoration-subtle decoration-dashed
        underline-offset-4 transition-all duration-150 ease-out
        hover:bg-[var(--fg-inverse)] hover:text-default hover:decoration-default
        hover:duration-75 hover:ease-in
      `}
      href={href}
    >
      {text}
    </a>
  );
}

function NavListItem({ value }: { value: NavItem }): JSX.Element {
  return (
    <li className="block w-1/2 text-2xl whitespace-nowrap">
      <a className="hover:text-accent" href={value.target}>
        {value.text}
      </a>
      <SubNavList values={value.subItems} />
    </li>
  );
}

function SubNavList({ values }: { values: NavItem[] }): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <ol className="mt-4">
      {values.map((value) => {
        return (
          <li
            className={`
              mb-4 ml-1 font-sans text-xs tracking-wide text-subtle uppercase
              last:mb-0
            `}
            key={value.target}
          >
            <a className="hover:text-default" href={value.target}>
              {value.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
