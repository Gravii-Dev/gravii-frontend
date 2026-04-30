"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";

import styles from "./gravii-logo.module.css";

type GraviiLogoProps = HTMLAttributes<HTMLSpanElement> & {
  decorative?: boolean;
  priority?: boolean;
  variant?: "symbol" | "wordmark" | "motion";
  spinY?: boolean;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function buildLabel(variant: NonNullable<GraviiLogoProps["variant"]>, decorative: boolean) {
  if (decorative) {
    return "";
  }

  if (variant === "wordmark") {
    return "Gravii wordmark";
  }

  if (variant === "motion") {
    return "Animated Gravii symbol";
  }

  return "Gravii symbol";
}

export default function GraviiLogo({
  className,
  decorative = false,
  priority = false,
  spinY = false,
  variant = "symbol",
  ...restProps
}: GraviiLogoProps) {
  const label = buildLabel(variant, decorative);
  const assetSrc =
    variant === "wordmark" ? "/brand/logo-wordmark.svg" : "/brand/logo-symbol.svg";
  const assetSizes = variant === "wordmark" ? "196px" : "80px";
  const assetDimensions =
    variant === "wordmark" ? { height: 93, width: 491 } : { height: 260, width: 206 };

  if (variant === "motion") {
    return (
      <span
        {...restProps}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        className={joinClasses(styles.root, styles.motion, spinY && styles.spinY, className)}
        role={decorative ? undefined : "img"}
      >
        <span className={styles.motionCore}>
          <Image alt="" fill priority={priority} sizes="128px" src="/brand/centre-circle.svg" />
        </span>
        <span className={styles.motionCurve}>
          <Image alt="" fill priority={priority} sizes="128px" src="/brand/curve.svg" />
        </span>
      </span>
    );
  }

  if (spinY) {
    return (
      <span
        {...restProps}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        className={joinClasses(
          styles.root,
          variant === "wordmark" ? styles.wordmark : styles.symbol,
          styles.spinY,
          className
        )}
        role={decorative ? undefined : "img"}
      >
        <span className={styles.spinScene}>
          <span className={styles.spinCard}>
            <span className={`${styles.spinFace} ${styles.spinFaceFront}`}>
              <Image
                alt=""
                className={styles.spinImage}
                height={assetDimensions.height}
                priority={priority}
                sizes={assetSizes}
                src={assetSrc}
                width={assetDimensions.width}
              />
            </span>
            <span className={`${styles.spinFace} ${styles.spinFaceBack}`}>
              <Image
                alt=""
                className={styles.spinImage}
                height={assetDimensions.height}
                priority={priority}
                sizes={assetSizes}
                src={assetSrc}
                width={assetDimensions.width}
              />
            </span>
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      {...restProps}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={joinClasses(
        styles.root,
        variant === "wordmark" ? styles.wordmark : styles.symbol,
        spinY && styles.spinY,
        className
      )}
      role={decorative ? undefined : "img"}
    >
      <Image
        alt=""
        fill
        priority={priority}
        sizes={assetSizes}
        src={assetSrc}
      />
    </span>
  );
}
