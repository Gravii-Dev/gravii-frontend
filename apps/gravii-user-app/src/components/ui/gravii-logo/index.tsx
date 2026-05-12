"use client";

import Image from "next/image";
import type { CSSProperties, HTMLAttributes } from "react";

import styles from "./gravii-logo.module.css";

type GraviiLogoProps = HTMLAttributes<HTMLSpanElement> & {
  decorative?: boolean;
  loading?: "eager" | "lazy";
  priority?: boolean;
  variant?: "symbol" | "wordmark" | "motion";
  spinY?: boolean;
};

type LogoStyleProperties = CSSProperties & {
  "--gravii-logo-image"?: string;
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
  loading,
  priority = false,
  spinY = false,
  variant = "symbol",
  ...restProps
}: GraviiLogoProps) {
  const label = buildLabel(variant, decorative);
  const assetSrc =
    variant === "wordmark" ? "/brand/logo-wordmark.svg" : "/brand/logo-symbol.svg";
  const assetSizes = variant === "wordmark" ? "456px" : "96px";
  const imageLoading = priority ? "eager" : loading;

  if (variant === "motion") {
    return (
      <span
        {...restProps}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        className={joinClasses(styles.root, styles.motion, className)}
        role={decorative ? undefined : "img"}
      >
        <span className={styles.motionCore}>
          <Image
            alt=""
            fill
            loading={imageLoading}
            priority={priority}
            sizes="128px"
            src="/brand/centre-circle.svg"
          />
        </span>
        <span className={styles.motionCurve}>
          <Image
            alt=""
            fill
            loading={imageLoading}
            priority={priority}
            sizes="128px"
            src="/brand/curve.svg"
          />
        </span>
      </span>
    );
  }

  if (spinY) {
    const spinStyle: LogoStyleProperties = {
      ...restProps.style,
      "--gravii-logo-image": `url("${assetSrc}")`,
    };

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
        style={spinStyle}
      >
        <span className={styles.spinScene}>
          <span className={styles.spinCard} aria-hidden="true">
            <span className={`${styles.spinFace} ${styles.spinFaceFront}`} />
            <span className={`${styles.spinFace} ${styles.spinFaceBack}`} />
            <span className={styles.spinEdge} />
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
        loading={imageLoading}
        priority={priority}
        sizes={assetSizes}
        src={assetSrc}
      />
    </span>
  );
}
