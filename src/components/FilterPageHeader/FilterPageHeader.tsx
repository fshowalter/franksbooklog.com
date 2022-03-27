import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import PageTitle from "../PageTitle";
import {
  avatarCss,
  breadcrumbCss,
  headingCss,
  taglineCss,
} from "./FilterPageHeader.module.scss";

type HeaderProps = {
  className: string;
  heading: React.ReactNode;
  tagline: React.ReactNode;
};

type WithBreadCrumpProps = {
  breadcrumb: React.ReactNode;
} & HeaderProps;

type WithAvatarProps = {
  avatar: IGatsbyImageData;
  alt: string;
} & WithBreadCrumpProps;

type WithAvatarElementProps = {
  avatarElement: JSX.Element;
} & WithBreadCrumpProps;

type Props =
  | HeaderProps
  | WithBreadCrumpProps
  | WithAvatarProps
  | WithAvatarElementProps;

export default function FilterPageHeader(props: Props): JSX.Element {
  let avatar;

  if ("avatar" in props) {
    avatar = (
      <GatsbyImage
        className={avatarCss}
        image={props.avatar}
        alt={props.alt}
        loading="eager"
      />
    );
  } else if ("avatarElement" in props) {
    avatar = <div className={avatarCss}>{props.avatarElement}</div>;
  }

  return (
    <header className={props.className}>
      {avatar}
      {"breadcrumb" in props && (
        <div className={breadcrumbCss}>{props.breadcrumb}</div>
      )}
      <PageTitle className={headingCss}>{props.heading}</PageTitle>
      <div className={taglineCss}>{props.tagline}</div>
    </header>
  );
}
