/* eslint-env browser, node */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { Link } from "gatsby";
import React from "react";
import ScreenReaderOnly from "../ScreenReaderOnly";
import SvgIcon from "../SvgIcon";
import {
  childrenCss,
  containerCss,
  footerCss,
  footerFairUseCss,
  footerNavListCss,
  footerNavListItemCss,
  mastHeaderCss,
  mastNavCss,
  mastNavLinkActiveCss,
  mastNavLinkCss,
  mastNavListCss,
  mastNavListItemCss,
  mastSearchFormCss,
  mastSearchIconCss,
  mastSearchInputCss,
  mastSearchSubmitCss,
  mastSearchWrapCss,
  mastTaglineCss,
  mastTitleCss,
  skipLinkCss,
} from "./Layout.module.scss";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

function MastNavItem({ to, children }: NavItemProps): JSX.Element {
  return (
    <li className={mastNavListItemCss}>
      <Link
        to={to}
        className={mastNavLinkCss}
        activeClassName={mastNavLinkActiveCss}
      >
        {children}
      </Link>
    </li>
  );
}

function FooterNavItem({ to, children }: NavItemProps): JSX.Element {
  return (
    <li className={footerNavListItemCss}>
      <Link to={to}>{children}</Link>
    </li>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <a className={skipLinkCss} href="#content">
        Skip to content
      </a>
      <div className={containerCss}>
        <header className={mastHeaderCss}>
          <h1 className={mastTitleCss}>
            <Link to="/">Frank&apos;s Book Log</Link>
          </h1>
          <p className={mastTaglineCss}>Literature is a relative term.</p>
          <form
            action="https://www.google.com/search"
            acceptCharset="UTF-8"
            method="get"
            role="search"
            className={mastSearchFormCss}
          >
            <label htmlFor="search" className={mastSearchWrapCss}>
              <ScreenReaderOnly>Search</ScreenReaderOnly>
              <input
                type="text"
                className={mastSearchInputCss}
                name="q"
                id="search"
                placeholder="Search..."
              />
              <input
                type="hidden"
                name="q"
                value="site:www.franksbooklog.com"
              />
              <button
                type="submit"
                className={mastSearchSubmitCss}
                value="Search"
                aria-label="Search"
              >
                <SvgIcon className={mastSearchIconCss}>
                  <path
                    fillRule="evenodd"
                    d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  />
                </SvgIcon>
              </button>
            </label>
          </form>
          <nav className={mastNavCss}>
            <ul className={mastNavListCss}>
              <MastNavItem to="/">Home</MastNavItem>
              <MastNavItem to="/how-i-grade/">How I Grade</MastNavItem>
              <MastNavItem to="/reviews/">Reviews</MastNavItem>
              <MastNavItem to="/shelf/">Shelf</MastNavItem>
            </ul>
          </nav>
        </header>
        <div id="content" className={childrenCss}>
          {children}
        </div>
        <footer className={footerCss}>
          <ul className={footerNavListCss}>
            <FooterNavItem to="/">Home</FooterNavItem>
            <FooterNavItem to="/how-i-grade/">How I Grade</FooterNavItem>
            <FooterNavItem to="/reviews/">Reviews</FooterNavItem>
            <FooterNavItem to="/shelf/">Shelf</FooterNavItem>
          </ul>
          <p className={footerFairUseCss}>
            All covers used in accordance with the{" "}
            <a href="http://www.copyright.gov/title17/92chap1.html#107">
              Fair Use Law.
            </a>
          </p>
          <ScreenReaderOnly>
            <a href="#top">To the top ???</a>
          </ScreenReaderOnly>
        </footer>
      </div>
    </>
  );
}
