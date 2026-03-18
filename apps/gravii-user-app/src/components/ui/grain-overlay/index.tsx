"use client";

import { useEffect, useRef } from "react";

import { buildPermTable, simplex2D } from "@/lib/simplex-noise";

import styles from "./grain-overlay.module.css";

type GrainOverlayProps = {
  variant: "panel" | "dock";
  active: boolean;
};

export default function GrainOverlay({ variant, active }: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasW = variant === "dock" ? 600 : 600;
  const canvasH = variant === "dock" ? 800 : 800;
  const opacityClass = active ? styles.active : styles.inactive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const offscreen = document.createElement("canvas");
    const ctx = offscreen.getContext("2d");

    if (!ctx) {
      return;
    }

    offscreen.width = canvasW;
    offscreen.height = canvasH;

    const { perm, permMod8 } = buildPermTable(42);
    const imageData = ctx.createImageData(canvasW, canvasH);
    const data = imageData.data;

    for (let py = 0; py < canvasH; py += 1) {
      for (let px = 0; px < canvasW; px += 1) {
        const idx = (py * canvasW + px) * 4;
        const nx = px / canvasW;
        const ny = py / canvasH;

        const n1 = simplex2D(nx * 3.5, ny * 3.5, perm, permMod8);
        const n2 = simplex2D(nx * 7, ny * 7, perm, permMod8) * 0.5;
        const n3 = simplex2D(nx * 14, ny * 14, perm, permMod8) * 0.25;
        const n4 = simplex2D(nx * 28, ny * 28, perm, permMod8) * 0.125;

        let blob = (n1 + n2 + n3 + n4) / 1.875;
        blob = blob * 0.5 + 0.5;

        const grain = Math.random();
        let val;

        if (blob < 0.38) {
          val = grain < 0.85 ? 255 : grain < 0.93 ? 180 + Math.random() * 75 : Math.random() * 80;
        } else if (blob > 0.62) {
          val = grain < 0.82 ? 0 : grain < 0.92 ? Math.random() * 80 : 180 + Math.random() * 75;
        } else {
          const mix = (blob - 0.38) / (0.62 - 0.38);
          val = grain < mix ? Math.random() * 60 : 200 + Math.random() * 55;
          if (Math.random() < 0.15) {
            val = Math.random() * 255;
          }
        }

        const foldDist = Math.abs(py - canvasH * 0.48);
        if (foldDist < 2) {
          val = val * 0.3 + 180 * 0.7;
        } else if (foldDist < 6) {
          val = val * 0.85 + 140 * 0.15;
        }

        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const render = () => {
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.clearRect(0, 0, width, height);
      context.drawImage(offscreen, 0, 0, width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(render);
    });

    resizeObserver.observe(canvas);
    render();

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasH, canvasW]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`${styles.overlay} ${styles.surface} ${variant === "dock" ? styles.dock : styles.panel} ${opacityClass}`} />;
}
