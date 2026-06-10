"use client";

import {
  useEffect,
  useRef,
  useState,
  type SVGProps,
} from "react";

import styles from "./morph-icon.module.css";

type IconLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
};

type IconShape = {
  lines: readonly [IconLine, IconLine, IconLine];
  rotation?: number;
};

export type MorphIconName =
  | "arrowLeft"
  | "arrowRight"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "chevronUp"
  | "cross"
  | "home"
  | "menu"
  | "minus"
  | "moon"
  | "plus"
  | "search"
  | "share"
  | "spark"
  | "sun"
  | "wallet";

type AnimatedShape = {
  lines: [Required<IconLine>, Required<IconLine>, Required<IconLine>];
  rotation: number;
};

type MorphIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: MorphIconName;
  durationMs?: number;
};

const collapsedLine: Required<IconLine> = {
  opacity: 0,
  x1: 8,
  x2: 8,
  y1: 8,
  y2: 8,
};

const ICON_SHAPES: Record<MorphIconName, IconShape> = {
  arrowLeft: {
    lines: [
      { x1: 10.5, y1: 4, x2: 5.5, y2: 8 },
      { x1: 5.5, y1: 8, x2: 10.5, y2: 12 },
      { x1: 6, y1: 8, x2: 13, y2: 8 },
    ],
  },
  arrowRight: {
    lines: [
      { x1: 5.5, y1: 4, x2: 10.5, y2: 8 },
      { x1: 10.5, y1: 8, x2: 5.5, y2: 12 },
      { x1: 3, y1: 8, x2: 10, y2: 8 },
    ],
  },
  check: {
    lines: [
      { x1: 3.5, y1: 8.4, x2: 6.6, y2: 11.2 },
      { x1: 6.6, y1: 11.2, x2: 12.6, y2: 4.8 },
      collapsedLine,
    ],
  },
  chevronDown: {
    lines: [
      { x1: 4.3, y1: 6, x2: 8, y2: 10 },
      { x1: 8, y1: 10, x2: 11.7, y2: 6 },
      collapsedLine,
    ],
  },
  chevronLeft: {
    lines: [
      { x1: 10, y1: 4.3, x2: 6, y2: 8 },
      { x1: 6, y1: 8, x2: 10, y2: 11.7 },
      collapsedLine,
    ],
  },
  chevronRight: {
    lines: [
      { x1: 6, y1: 4.3, x2: 10, y2: 8 },
      { x1: 10, y1: 8, x2: 6, y2: 11.7 },
      collapsedLine,
    ],
  },
  chevronUp: {
    lines: [
      { x1: 4.3, y1: 10, x2: 8, y2: 6 },
      { x1: 8, y1: 6, x2: 11.7, y2: 10 },
      collapsedLine,
    ],
  },
  cross: {
    lines: [
      { x1: 4.5, y1: 4.5, x2: 11.5, y2: 11.5 },
      { x1: 11.5, y1: 4.5, x2: 4.5, y2: 11.5 },
      collapsedLine,
    ],
  },
  home: {
    lines: [
      { x1: 3.4, y1: 7.4, x2: 8, y2: 3.8 },
      { x1: 8, y1: 3.8, x2: 12.6, y2: 7.4 },
      { x1: 4.6, y1: 7.3, x2: 4.6, y2: 12.4 },
    ],
  },
  menu: {
    lines: [
      { x1: 3.8, y1: 5, x2: 12.2, y2: 5 },
      { x1: 3.8, y1: 8, x2: 12.2, y2: 8 },
      { x1: 3.8, y1: 11, x2: 12.2, y2: 11 },
    ],
  },
  minus: {
    lines: [
      { x1: 4, y1: 8, x2: 12, y2: 8 },
      collapsedLine,
      collapsedLine,
    ],
  },
  moon: {
    lines: [
      { x1: 9.8, y1: 3.8, x2: 6.4, y2: 6.1 },
      { x1: 6.4, y1: 6.1, x2: 6.7, y2: 10.3 },
      { x1: 6.7, y1: 10.3, x2: 11.3, y2: 11.4 },
    ],
  },
  plus: {
    lines: [
      { x1: 4, y1: 8, x2: 12, y2: 8 },
      { x1: 8, y1: 4, x2: 8, y2: 12 },
      collapsedLine,
    ],
  },
  search: {
    lines: [
      { x1: 5, y1: 5, x2: 9.5, y2: 9.5 },
      { x1: 9.4, y1: 9.4, x2: 12.4, y2: 12.4 },
      { x1: 5, y1: 9.5, x2: 9.5, y2: 5 },
    ],
  },
  share: {
    lines: [
      { x1: 4, y1: 10.5, x2: 10.5, y2: 4 },
      { x1: 10.5, y1: 4, x2: 10.5, y2: 8.4 },
      { x1: 10.5, y1: 4, x2: 6.1, y2: 4 },
    ],
  },
  spark: {
    lines: [
      { x1: 8, y1: 3.4, x2: 8, y2: 12.6 },
      { x1: 3.4, y1: 8, x2: 12.6, y2: 8 },
      { x1: 4.9, y1: 4.9, x2: 11.1, y2: 11.1 },
    ],
  },
  sun: {
    lines: [
      { x1: 8, y1: 3.1, x2: 8, y2: 12.9 },
      { x1: 3.1, y1: 8, x2: 12.9, y2: 8 },
      { x1: 4.6, y1: 4.6, x2: 11.4, y2: 11.4 },
    ],
  },
  wallet: {
    lines: [
      { x1: 3.4, y1: 5, x2: 12.3, y2: 5 },
      { x1: 3.4, y1: 5, x2: 3.4, y2: 11.5 },
      { x1: 7.8, y1: 8.4, x2: 12.7, y2: 8.4 },
    ],
  },
};

function normalizeLine(line: IconLine): Required<IconLine> {
  return {
    opacity: line.opacity ?? 1,
    x1: line.x1,
    x2: line.x2,
    y1: line.y1,
    y2: line.y2,
  };
}

function normalizeShape(shape: IconShape): AnimatedShape {
  return {
    lines: [
      normalizeLine(shape.lines[0]),
      normalizeLine(shape.lines[1]),
      normalizeLine(shape.lines[2]),
    ],
    rotation: shape.rotation ?? 0,
  };
}

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

function interpolateShape(from: AnimatedShape, to: AnimatedShape, progress: number): AnimatedShape {
  const eased = easeOutQuart(progress);

  return {
    lines: from.lines.map((line, index) => {
      const target = to.lines[index];

      return {
        opacity: interpolate(line.opacity, target.opacity, eased),
        x1: interpolate(line.x1, target.x1, eased),
        x2: interpolate(line.x2, target.x2, eased),
        y1: interpolate(line.y1, target.y1, eased),
        y2: interpolate(line.y2, target.y2, eased),
      };
    }) as AnimatedShape["lines"],
    rotation: interpolate(from.rotation, to.rotation, eased),
  };
}

function readReducedMotionPreference() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function MorphIcon({
  className,
  durationMs = 240,
  name,
  ...svgProps
}: MorphIconProps) {
  const [shape, setShape] = useState(() => normalizeShape(ICON_SHAPES[name]));
  const shapeRef = useRef(shape);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    const targetShape = normalizeShape(ICON_SHAPES[name]);

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (durationMs <= 0 || readReducedMotionPreference()) {
      frameRef.current = window.requestAnimationFrame(() => {
        shapeRef.current = targetShape;
        setShape(targetShape);
        frameRef.current = null;
      });

      return () => {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      };
    }

    const fromShape = shapeRef.current;
    const start = window.performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const nextShape = interpolateShape(fromShape, targetShape, progress);

      shapeRef.current = nextShape;
      setShape(nextShape);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    }

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [durationMs, name]);

  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      className={[styles.icon, className].filter(Boolean).join(" ")}
      focusable="false"
      viewBox="0 0 16 16"
    >
      <g transform={`rotate(${shape.rotation} 8 8)`}>
        {shape.lines.map((line, index) => (
          <line
            key={index}
            className={styles.line}
            opacity={line.opacity}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          />
        ))}
      </g>
    </svg>
  );
}
