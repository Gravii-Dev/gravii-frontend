"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./expressive-cursor.module.css";

type CursorVariant = "default" | "pill" | "checked" | "hidden";

type CursorVisualState = {
  isActive: boolean;
  isPressed: boolean;
  isVisible: boolean;
  label: string;
  variant: CursorVariant;
};

const CURSOR_TARGET_SELECTOR = "[data-cursor-target]";
const IMPLICIT_CURSOR_TARGET_SELECTOR = "button:not(:disabled), a[href], [role='button']";
const NATIVE_CURSOR_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [contenteditable=''], [data-cursor-native='true']";

const DEFAULT_VISUAL_STATE: CursorVisualState = {
  isActive: false,
  isPressed: false,
  isVisible: false,
  label: "",
  variant: "default",
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function normalizeCursorVariant(value: string | undefined): CursorVariant {
  if (value === "pill" || value === "checked" || value === "hidden") {
    return value;
  }

  return "default";
}

function statesMatch(left: CursorVisualState, right: CursorVisualState) {
  return (
    left.isActive === right.isActive &&
    left.isPressed === right.isPressed &&
    left.isVisible === right.isVisible &&
    left.label === right.label &&
    left.variant === right.variant
  );
}

function shouldUseNativeCursor(target: Element | null) {
  return Boolean(target?.closest(NATIVE_CURSOR_SELECTOR));
}

function isDisabledTarget(target: HTMLElement) {
  return target.matches(":disabled") || target.getAttribute("aria-disabled") === "true";
}

function readCursorState(eventTarget: EventTarget | null, isPressed: boolean): CursorVisualState {
  if (!(eventTarget instanceof Element)) {
    return DEFAULT_VISUAL_STATE;
  }

  if (shouldUseNativeCursor(eventTarget)) {
    return {
      ...DEFAULT_VISUAL_STATE,
      variant: "hidden",
    };
  }

  const cursorTarget = eventTarget.closest<HTMLElement>(CURSOR_TARGET_SELECTOR);

  if (cursorTarget && isDisabledTarget(cursorTarget)) {
    return {
      ...DEFAULT_VISUAL_STATE,
      isPressed,
      isVisible: true,
    };
  }

  const implicitTarget = eventTarget.closest<HTMLElement>(IMPLICIT_CURSOR_TARGET_SELECTOR);
  const interactiveTarget = cursorTarget ?? implicitTarget;

  if (!interactiveTarget) {
    return {
      ...DEFAULT_VISUAL_STATE,
      isPressed,
      isVisible: true,
    };
  }

  const variant = normalizeCursorVariant(cursorTarget?.dataset.cursorVariant);

  if (variant === "hidden") {
    return {
      ...DEFAULT_VISUAL_STATE,
      variant,
    };
  }

  return {
    isActive: true,
    isPressed,
    isVisible: true,
    label: cursorTarget?.dataset.cursorLabel ?? "",
    variant,
  };
}

function syncCursorPosition(cursor: HTMLElement | null, label: HTMLElement | null, event: PointerEvent) {
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;

  if (cursor) {
    cursor.style.left = x;
    cursor.style.top = y;
  }

  if (label) {
    label.style.left = x;
    label.style.top = y;
  }
}

export default function ExpressiveCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const pressedRef = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [visualState, setVisualState] = useState<CursorVisualState>(DEFAULT_VISUAL_STATE);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncEnabledState() {
      setIsEnabled(pointerQuery.matches && !reducedMotionQuery.matches);
    }

    syncEnabledState();
    pointerQuery.addEventListener("change", syncEnabledState);
    reducedMotionQuery.addEventListener("change", syncEnabledState);

    return () => {
      pointerQuery.removeEventListener("change", syncEnabledState);
      reducedMotionQuery.removeEventListener("change", syncEnabledState);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      delete document.documentElement.dataset.expressiveCursor;
      pressedRef.current = false;
      return;
    }

    document.documentElement.dataset.expressiveCursor = "true";

    function updateVisualState(nextState: CursorVisualState) {
      setVisualState((currentState) => (statesMatch(currentState, nextState) ? currentState : nextState));
    }

    function handlePointerMove(event: PointerEvent) {
      syncCursorPosition(cursorRef.current, labelRef.current, event);
      updateVisualState(readCursorState(event.target, pressedRef.current));
    }

    function handlePointerDown(event: PointerEvent) {
      pressedRef.current = true;
      updateVisualState(readCursorState(event.target, true));
    }

    function handlePointerUp(event: PointerEvent) {
      pressedRef.current = false;
      updateVisualState(readCursorState(event.target, false));
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        pressedRef.current = false;
        updateVisualState(DEFAULT_VISUAL_STATE);
      }
    }

    function handleWindowBlur() {
      pressedRef.current = false;
      updateVisualState(DEFAULT_VISUAL_STATE);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      delete document.documentElement.dataset.expressiveCursor;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  const hasLabel = visualState.isActive && visualState.isVisible && visualState.label.length > 0;

  return (
    <>
      <div
        ref={cursorRef}
        className={joinClasses(
          styles.cursor,
          visualState.isVisible && styles.visible,
          visualState.isActive && styles.active,
          visualState.isPressed && styles.pressed,
          visualState.variant === "checked" && styles.checked,
          visualState.variant === "hidden" && styles.hidden,
        )}
        data-testid="expressive-cursor"
        aria-hidden="true"
      />
      <div
        ref={labelRef}
        className={joinClasses(
          styles.label,
          hasLabel && styles.labelActive,
          visualState.variant === "pill" && styles.labelPill,
        )}
        data-testid="expressive-cursor-label"
        aria-hidden="true"
      >
        {visualState.label}
      </div>
    </>
  );
}
