"use client";

import type { HTMLAttributes } from "react";

import styles from "./depth-icon.module.css";

export type DepthIconName =
  | "discovery"
  | "home"
  | "identity"
  | "myspace"
  | "ranking"
  | "xray";

type DepthIconProps = HTMLAttributes<HTMLSpanElement> & {
  name: DepthIconName;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function renderGlyph(name: DepthIconName) {
  if (name === "identity") {
    return (
      <>
        <circle cx="32" cy="25" r="9" />
        <path d="M17 51c3.4-10.6 8.2-15.6 15-15.6s11.6 5 15 15.6" />
        <path d="M46 17l5 5 8-9" />
      </>
    );
  }

  if (name === "xray") {
    return (
      <>
        <rect x="17" y="17" width="30" height="30" rx="10" />
        <path d="M23 32h18" />
        <path d="M32 23v18" />
        <circle cx="45" cy="20" r="5" />
      </>
    );
  }

  if (name === "discovery") {
    return (
      <>
        <path d="M32 13l5.8 12.2L51 31l-13.2 5.8L32 50l-5.8-13.2L13 31l13.2-5.8L32 13z" />
        <path d="M48 13l2.2 4.8L55 20l-4.8 2.2L48 27l-2.2-4.8L41 20l4.8-2.2L48 13z" />
      </>
    );
  }

  if (name === "ranking") {
    return (
      <>
        <path d="M17 48h10V30H17v18z" />
        <path d="M29 48h10V18H29v30z" />
        <path d="M41 48h10V25H41v23z" />
        <path d="M21 22l9-9 7 7 9-11" />
      </>
    );
  }

  if (name === "myspace") {
    return (
      <>
        <path d="M18 20h28c4.4 0 8 3.6 8 8v8c0 4.4-3.6 8-8 8H18V20z" />
        <circle cx="28" cy="32" r="5" />
        <path d="M39 27l7 5-7 5V27z" />
      </>
    );
  }

  return (
    <>
      <path d="M17 32l15-14 15 14" />
      <path d="M22 31v18h20V31" />
      <path d="M29 49V37h6v12" />
    </>
  );
}

export default function DepthIcon({ className, name, ...restProps }: DepthIconProps) {
  return (
    <span
      {...restProps}
      aria-hidden="true"
      className={joinClasses(styles.root, className)}
      data-depth-icon={name}
    >
      <span className={styles.shadow} />
      <span className={styles.plate}>
        <span className={styles.backGlow} />
        <svg className={styles.glyph} viewBox="0 0 64 64" focusable="false">
          {renderGlyph(name)}
        </svg>
      </span>
    </span>
  );
}
