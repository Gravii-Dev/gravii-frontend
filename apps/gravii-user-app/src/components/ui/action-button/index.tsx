"use client";

import { useState, type ButtonHTMLAttributes, type FocusEvent, type MouseEvent, type ReactNode } from "react";

import MorphIcon, { type MorphIconName } from "@/components/ui/morph-icon";
import styles from "./action-button.module.css";

type ActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  dark?: boolean;
  hoverIcon?: MorphIconName;
  icon?: MorphIconName;
  iconPlacement?: "start" | "end";
  pressedIcon?: MorphIconName;
  size?: "compact" | "panel";
  stopPropagation?: boolean;
  pressed?: boolean;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function ActionButton({
  children,
  className,
  dark = false,
  hoverIcon,
  icon,
  iconPlacement = "start",
  pressedIcon,
  size = "panel",
  stopPropagation = true,
  pressed,
  onBlur,
  onClick,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  type = "button",
  ...buttonProps
}: ActionButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isInteractive = !buttonProps.disabled;
  const iconName =
    isInteractive && (isHovered || isFocused) && hoverIcon
      ? hoverIcon
      : pressed && pressedIcon
        ? pressedIcon
        : icon;

  return (
    <button
      data-cursor-target="action"
      data-cursor-variant="pill"
      {...buttonProps}
      type={type}
      className={joinClasses(styles.button, dark ? styles.dark : styles.light, size === "compact" ? styles.compact : styles.panel, className)}
      aria-pressed={pressed}
      onBlur={(event: FocusEvent<HTMLButtonElement>) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (stopPropagation) {
          event.stopPropagation();
        }

        onClick?.(event);
      }}
      onFocus={(event: FocusEvent<HTMLButtonElement>) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
        setIsHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
        setIsHovered(false);
        onMouseLeave?.(event);
      }}
    >
      <span className={styles.inner}>
        <span className={styles.front} data-liquid-glass="button">
          <span className={styles.frontBackground} aria-hidden="true" />
          <span className={styles.frontText}>
            {iconName ? (
              <span className={joinClasses(styles.contentWithIcon, iconPlacement === "end" && styles.contentWithEndIcon)}>
                <MorphIcon name={iconName} className={styles.icon} />
                <span>{children}</span>
              </span>
            ) : (
              children
            )}
          </span>
        </span>
      </span>
    </button>
  );
}
