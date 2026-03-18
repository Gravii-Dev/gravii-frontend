"use client";

import { useEffect, useRef } from "react";

import { PERSONA_ITEMS } from "@/features/profile/persona-data";

import { renderInfiniteCanvasScene } from "./infinite-canvas-renderer";
import styles from "./infinite-canvas.module.css";

type InfiniteCanvasState = {
  scrollX: number;
  scrollY: number;
  velX: number;
  velY: number;
  animFrame: number | null;
};

type InfiniteCanvasProps = {
  dark: boolean;
  connected: boolean;
  activeIndex: number | null;
};

export default function InfiniteCanvas({ dark, connected, activeIndex }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<() => void>(() => {});
  const stateRef = useRef<InfiniteCanvasState>({ scrollX: 0, scrollY: 0, velX: 0, velY: 0, animFrame: null });

  const cardWidth = 360;
  const cardHeight = 260;
  const gap = 32;
  const columns = 5;
  const rows = Math.ceil(PERSONA_ITEMS.length / columns);
  const gridWidth = columns * (cardWidth + gap);
  const gridHeight = rows * (cardHeight + gap);

  useEffect(() => {
    drawRef.current = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;

      if (!container || !canvas) {
        return;
      }

      renderInfiniteCanvasScene({
        canvas,
        container,
        dark,
        connected,
        activeIndex,
        scrollX: stateRef.current.scrollX,
        scrollY: stateRef.current.scrollY,
        cardWidth,
        cardHeight,
        gap,
        columns,
        gridWidth,
        gridHeight,
      });
    };

    drawRef.current();
  }, [activeIndex, cardHeight, cardWidth, columns, connected, dark, gap, gridHeight, gridWidth]);

  useEffect(() => {
    const state = stateRef.current;
    state.scrollX = -gridWidth;
    state.scrollY = -gridHeight;
    state.velX = 0;
    state.velY = 0;
    drawRef.current();
  }, [gridHeight, gridWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => drawRef.current());
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const state = stateRef.current;
      state.velX += -event.deltaX * 0.1;
      state.velY += -event.deltaY * 0.1;
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    let running = true;

    const tick = () => {
      if (!running) {
        return;
      }

      if (Math.abs(state.velX) > 0.05 || Math.abs(state.velY) > 0.05) {
        state.scrollX += state.velX;
        state.scrollY += state.velY;
        state.velX *= 0.95;
        state.velY *= 0.95;

        if (state.scrollX > 0) state.scrollX -= gridWidth;
        if (state.scrollX < -2 * gridWidth) state.scrollX += gridWidth;
        if (state.scrollY > 0) state.scrollY -= gridHeight;
        if (state.scrollY < -2 * gridHeight) state.scrollY += gridHeight;

        drawRef.current();
      }

      state.animFrame = requestAnimationFrame(tick);
    };

    state.animFrame = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(state.animFrame ?? 0);
    };
  }, [gridHeight, gridWidth]);

  return (
    <div ref={containerRef} className={`${styles.canvasWrap} ${dark ? styles.dark : styles.light}`}>
      <canvas ref={canvasRef} aria-hidden="true" className={styles.canvasSurface} />
      <div className={styles.canvasFade} />
    </div>
  );
}
