import { PERSONA_ITEMS } from "@/features/profile/persona-data";

type CanvasTheme = {
  text: string;
  sub: string;
  cardBackground: string;
  cardBorder: string;
  activeBorder: string;
  activeBackground: string;
  activeLabel: string;
  activeDescription: string;
  description: string;
};

type DrawTileOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  dark: boolean;
  isActive: boolean;
  name: string;
  desc: string;
  gradient: [string, string, string];
  accentFont: string;
  uiFont: string;
  serifFont: string;
};

type RenderInfiniteCanvasSceneOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  dark: boolean;
  connected: boolean;
  activeIndex: number | null;
  scrollX: number;
  scrollY: number;
  cardWidth: number;
  cardHeight: number;
  gap: number;
  columns: number;
  gridWidth: number;
  gridHeight: number;
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  const value = Number.parseInt(safeHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const limit = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + limit, y);
  ctx.lineTo(x + width - limit, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + limit);
  ctx.lineTo(x + width, y + height - limit);
  ctx.quadraticCurveTo(x + width, y + height, x + width - limit, y + height);
  ctx.lineTo(x + limit, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - limit);
  ctx.lineTo(x, y + limit);
  ctx.quadraticCurveTo(x, y, x + limit, y);
  ctx.closePath();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  const limitedLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && limitedLines.length > 0) {
    const lastIndex = limitedLines.length - 1;
    let lastLine = limitedLines[lastIndex];

    while (ctx.measureText(`${lastLine}…`).width > maxWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
    }

    limitedLines[lastIndex] = `${lastLine}…`;
  }

  limitedLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function themeFor(dark: boolean): CanvasTheme {
  return {
    text: dark ? "#F5F2EB" : "#1A1A1A",
    sub: dark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.35)",
    cardBackground: dark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
    cardBorder: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    activeBorder: "rgba(230, 220, 250, 0.4)",
    activeBackground: dark ? "rgba(230, 220, 250, 0.06)" : "rgba(230, 220, 250, 0.08)",
    activeLabel: "rgba(230, 220, 250, 0.8)",
    activeDescription: "rgba(230, 220, 250, 0.5)",
    description: dark ? "rgba(255, 255, 255, 0.24)" : "rgba(0, 0, 0, 0.2)",
  };
}

function fontValue(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function drawTile(ctx: CanvasRenderingContext2D, options: DrawTileOptions) {
  const { x, y, width, height, index, dark, isActive, name, desc, gradient, accentFont, uiFont, serifFont } = options;
  const theme = themeFor(dark);
  const [gradientA, gradientB, gradientC] = gradient;

  roundedRectPath(ctx, x, y, width, height, 16);
  ctx.fillStyle = isActive ? theme.activeBackground : theme.cardBackground;
  ctx.fill();
  ctx.strokeStyle = isActive ? theme.activeBorder : theme.cardBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  roundedRectPath(ctx, x, y, width, height, 16);
  ctx.clip();

  const glowOne = ctx.createRadialGradient(x + width * 0.3, y + height * 0.3, 0, x + width * 0.3, y + height * 0.3, width * 0.7);
  glowOne.addColorStop(0, hexToRgba(gradientA, isActive ? 0.3 : 0.12));
  glowOne.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowOne;
  ctx.fillRect(x, y, width, height);

  const glowTwo = ctx.createRadialGradient(x + width * 0.7, y + height * 0.7, 0, x + width * 0.7, y + height * 0.7, width * 0.7);
  glowTwo.addColorStop(0, hexToRgba(gradientB, isActive ? 0.26 : 0.1));
  glowTwo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowTwo;
  ctx.fillRect(x, y, width, height);

  const glowThree = ctx.createRadialGradient(x + width * 0.5, y + height * 0.2, 0, x + width * 0.5, y + height * 0.2, width * 0.55);
  glowThree.addColorStop(0, hexToRgba(gradientC, isActive ? 0.22 : 0.08));
  glowThree.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowThree;
  ctx.fillRect(x, y, width, height);

  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 72px ${accentFont}`;
  ctx.fillStyle = isActive ? theme.activeLabel : theme.text;
  ctx.globalAlpha = isActive ? 1 : 0.12 + (index % 4) * 0.08;
  ctx.fillText(String(index + 1).padStart(2, "0"), x + width / 2, y + height * 0.43);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 11px ${uiFont}`;
  ctx.fillStyle = isActive ? theme.activeLabel : theme.sub;
  ctx.fillText(name.toUpperCase(), x + width / 2, y + height * 0.66);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `italic 10px ${serifFont}`;
  ctx.fillStyle = isActive ? theme.activeDescription : theme.description;
  drawWrappedText(ctx, `“${desc}”`, x + width / 2, y + height * 0.72, width * 0.72, 14, 3);
  ctx.restore();
}

export function renderInfiniteCanvasScene({
  canvas,
  container,
  dark,
  connected,
  activeIndex,
  scrollX,
  scrollY,
  cardWidth,
  cardHeight,
  gap,
  columns,
  gridWidth,
  gridHeight,
}: RenderInfiniteCanvasSceneOptions) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const bounds = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(bounds.width * dpr));
  const height = Math.max(1, Math.round(bounds.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);

  const accentFont = fontValue("--font-accent", '"Lilita One", sans-serif');
  const uiFont = fontValue("--font-ui", '"Outfit", sans-serif');
  const serifFont = fontValue("--font-serif", '"Fraunces", serif');

  for (let tileY = 0; tileY < 3; tileY += 1) {
    for (let tileX = 0; tileX < 3; tileX += 1) {
      PERSONA_ITEMS.forEach((item, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = tileX * gridWidth + column * (cardWidth + gap) + scrollX;
        const y = tileY * gridHeight + row * (cardHeight + gap) + scrollY;

        if (x + cardWidth < -80 || x > bounds.width + 80 || y + cardHeight < -80 || y > bounds.height + 80) {
          return;
        }

        drawTile(context, {
          x,
          y,
          width: cardWidth,
          height: cardHeight,
          index,
          dark,
          isActive: connected && index === activeIndex,
          name: item.name,
          desc: item.desc,
          gradient: item.gradient,
          accentFont,
          uiFont,
          serifFont,
        });
      });
    }
  }
}
