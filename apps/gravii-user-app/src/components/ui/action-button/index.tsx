"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import styles from "./action-button.module.css";

type ActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  dark?: boolean;
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
  size = "panel",
  stopPropagation = true,
  pressed,
  onClick,
  type = "button",
  ...buttonProps
}: ActionButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      className={joinClasses(styles.button, dark ? styles.dark : styles.light, size === "compact" ? styles.compact : styles.panel, className)}
      aria-pressed={pressed}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (stopPropagation) {
          event.stopPropagation();
        }

        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
