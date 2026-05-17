"use client";

import { useEffect, useRef } from "react";

import styles from "./theme-ink-transition.module.css";

type ThemeName = "light" | "dark";

type ThemeInkTransitionProps = {
  durationMs: number;
  from: ThemeName;
  to: ThemeName;
};

type ShaderUniforms = {
  color1: WebGLUniformLocation;
  color2: WebGLUniformLocation;
  clicked: WebGLUniformLocation;
};

const THEME_COLORS = {
  light: [253 / 255, 250 / 255, 243 / 255],
  dark: [5 / 255, 5 / 255, 5 / 255],
} satisfies Record<ThemeName, readonly [number, number, number]>;

const FALLBACK_WIDTH = 360;
const FALLBACK_HEIGHT = 240;

const VERTEX_SHADER_SOURCE = `
attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uClicked;

float r(in vec2 p) {
  return fract(cos(p.x * 42.98 + p.y * 43.23) * 1127.53);
}

float n(in vec2 p) {
  vec2 fn = floor(p);
  vec2 sn = smoothstep(vec2(0.0), vec2(1.0), fract(p));

  float h1 = mix(r(fn), r(fn + vec2(1.0, 0.0)), sn.x);
  float h2 = mix(r(fn + vec2(0.0, 1.0)), r(fn + vec2(1.0)), sn.x);
  return mix(h1, h2, sn.y);
}

float noise(in vec2 p) {
  return n(p / 32.0) * 0.58 +
         n(p / 16.0) * 0.2 +
         n(p / 8.0) * 0.1 +
         n(p / 4.0) * 0.05 +
         n(p / 2.0) * 0.02 +
         n(p) * 0.0125;
}

void main() {
  float t = uClicked;
  float progress = smoothstep(t + 0.1, t - 0.1, noise(gl_FragCoord.xy * 0.2));
  gl_FragColor = mix(vec4(uColor1, 1.0), vec4(uColor2, 1.0), progress);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): ShaderUniforms | null {
  const color1 = gl.getUniformLocation(program, "uColor1");
  const color2 = gl.getUniformLocation(program, "uColor2");
  const clicked = gl.getUniformLocation(program, "uClicked");

  if (!color1 || !color2 || !clicked) {
    return null;
  }

  return {
    color1,
    color2,
    clicked,
  };
}

function easeOutQuad(progress: number) {
  return 1 - (1 - progress) * (1 - progress);
}

function fract(value: number) {
  return value - Math.floor(value);
}

function randomNoise(pointX: number, pointY: number) {
  return fract(Math.cos(pointX * 42.98 + pointY * 43.23) * 1127.53);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return 0;
  }

  const progress = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return progress * progress * (3 - 2 * progress);
}

function valueNoise(pointX: number, pointY: number) {
  const floorX = Math.floor(pointX);
  const floorY = Math.floor(pointY);
  const smoothX = smoothstep(0, 1, fract(pointX));
  const smoothY = smoothstep(0, 1, fract(pointY));
  const top = randomNoise(floorX, floorY) * (1 - smoothX) + randomNoise(floorX + 1, floorY) * smoothX;
  const bottom =
    randomNoise(floorX, floorY + 1) * (1 - smoothX) + randomNoise(floorX + 1, floorY + 1) * smoothX;

  return top * (1 - smoothY) + bottom * smoothY;
}

function shaderNoise(pointX: number, pointY: number) {
  return (
    valueNoise(pointX / 32, pointY / 32) * 0.58 +
    valueNoise(pointX / 16, pointY / 16) * 0.2 +
    valueNoise(pointX / 8, pointY / 8) * 0.1 +
    valueNoise(pointX / 4, pointY / 4) * 0.05 +
    valueNoise(pointX / 2, pointY / 2) * 0.02 +
    valueNoise(pointX, pointY) * 0.0125
  );
}

function setupCanvasFallback(
  canvas: HTMLCanvasElement,
  durationMs: number,
  fromColor: readonly [number, number, number],
  toColor: readonly [number, number, number],
) {
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    return undefined;
  }

  const renderContext = context;
  canvas.width = FALLBACK_WIDTH;
  canvas.height = FALLBACK_HEIGHT;
  renderContext.imageSmoothingEnabled = true;

  const imageData = renderContext.createImageData(FALLBACK_WIDTH, FALLBACK_HEIGHT);
  const noiseMap = new Float32Array(FALLBACK_WIDTH * FALLBACK_HEIGHT);

  for (let y = 0; y < FALLBACK_HEIGHT; y += 1) {
    for (let x = 0; x < FALLBACK_WIDTH; x += 1) {
      const index = y * FALLBACK_WIDTH + x;
      noiseMap[index] = shaderNoise(x * 4 * 0.2, y * 4 * 0.2);
    }
  }

  let animationFrame = 0;
  let startTime: number | null = null;

  function render(progress: number) {
    const data = imageData.data;

    for (let index = 0; index < noiseMap.length; index += 1) {
      const mixProgress = smoothstep(progress + 0.1, progress - 0.1, noiseMap[index]);
      const dataIndex = index * 4;
      data[dataIndex] = Math.round((fromColor[0] * (1 - mixProgress) + toColor[0] * mixProgress) * 255);
      data[dataIndex + 1] = Math.round((fromColor[1] * (1 - mixProgress) + toColor[1] * mixProgress) * 255);
      data[dataIndex + 2] = Math.round((fromColor[2] * (1 - mixProgress) + toColor[2] * mixProgress) * 255);
      data[dataIndex + 3] = 255;
    }

    renderContext.putImageData(imageData, 0, 0);
  }

  function animate(now: number) {
    if (startTime === null) {
      startTime = now;
    }

    const linearProgress = Math.min(1, (now - startTime) / durationMs);
    render(easeOutQuad(linearProgress));

    if (linearProgress < 1) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  }

  render(0);
  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
  };
}

export default function ThemeInkTransition({ durationMs, from, to }: ThemeInkTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const fromColor = THEME_COLORS[from];
    const toColor = THEME_COLORS[to];
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      desynchronized: true,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      return setupCanvasFallback(canvas, durationMs, fromColor, toColor);
    }

    const program = createProgram(gl);

    if (!program) {
      return undefined;
    }

    const uniforms = getUniforms(gl, program);
    const positionAttribute = gl.getAttribLocation(program, "aPosition");
    const positionBuffer = gl.createBuffer();

    if (!uniforms || positionAttribute < 0 || !positionBuffer) {
      gl.deleteProgram(program);
      return undefined;
    }

    const renderCanvas = canvas;
    const renderGl = gl;
    const renderProgram = program;
    const renderUniforms = uniforms;
    let animationFrame = 0;
    let startTime: number | null = null;

    function resizeCanvas() {
      const rect = renderCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (renderCanvas.width !== width || renderCanvas.height !== height) {
        renderCanvas.width = width;
        renderCanvas.height = height;
      }

      renderGl.viewport(0, 0, width, height);
    }

    function render(progress: number) {
      renderGl.useProgram(renderProgram);
      renderGl.uniform3f(renderUniforms.color1, fromColor[0], fromColor[1], fromColor[2]);
      renderGl.uniform3f(renderUniforms.color2, toColor[0], toColor[1], toColor[2]);
      renderGl.uniform1f(renderUniforms.clicked, progress);
      renderGl.drawArrays(renderGl.TRIANGLES, 0, 3);
    }

    function animate(now: number) {
      if (startTime === null) {
        startTime = now;
      }

      const linearProgress = Math.min(1, (now - startTime) / durationMs);
      render(easeOutQuad(linearProgress));

      if (linearProgress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    renderGl.bindBuffer(renderGl.ARRAY_BUFFER, positionBuffer);
    renderGl.bufferData(renderGl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), renderGl.STATIC_DRAW);
    renderGl.enableVertexAttribArray(positionAttribute);
    renderGl.vertexAttribPointer(positionAttribute, 2, renderGl.FLOAT, false, 0, 0);

    resizeCanvas();
    render(0);
    window.addEventListener("resize", resizeCanvas);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      renderGl.deleteBuffer(positionBuffer);
      renderGl.deleteProgram(renderProgram);
    };
  }, [durationMs, from, to]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
