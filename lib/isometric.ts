export const TILE_W = 72;
export const TILE_H = 36;
export const BLOCK_H = 28;
export const VALUE_SCALE = 4;

export function gridToScreen(x: number, y: number, z = 0) {
  const sx = (x - y) * (TILE_W / 2);
  const sy = (x + y) * (TILE_H / 2) - z * BLOCK_H;
  return { x: sx, y: sy };
}

export function heightUnits(value?: string | number, base = 2) {
  if (value === undefined || value === "") return base;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isNaN(n)) return base;
  return Math.max(base, Math.min(10, base + Math.round(n / 2)));
}

export function getViewBox(
  elements: { x: number; y: number; z?: number; value?: string | number }[],
  floorPad = 2
) {
  if (elements.length === 0) {
    return { minX: -120, minY: -80, width: 480, height: 360, floorMinX: -1, floorMaxX: 4, floorMinY: -1, floorMaxY: 2 };
  }

  let minGx = Infinity;
  let maxGx = -Infinity;
  let minGy = Infinity;
  let maxGy = -Infinity;

  for (const el of elements) {
    minGx = Math.min(minGx, el.x);
    maxGx = Math.max(maxGx, el.x);
    minGy = Math.min(minGy, el.y);
    maxGy = Math.max(maxGy, el.y);
  }

  const floorMinX = minGx - floorPad;
  const floorMaxX = maxGx + floorPad;
  const floorMinY = minGy - floorPad;
  const floorMaxY = maxGy + floorPad;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const corners = [
    gridToScreen(floorMinX, floorMinY, 0),
    gridToScreen(floorMaxX, floorMinY, 0),
    gridToScreen(floorMinX, floorMaxY, 0),
    gridToScreen(floorMaxX, floorMaxY, 0),
  ];

  for (const el of elements) {
    const h = heightUnits(el.value, el.z ?? 2);
    const { x, y } = gridToScreen(el.x, el.y, h);
    const blockH = h * BLOCK_H + TILE_H * 3;
    minX = Math.min(minX, x - TILE_W, ...corners.map((c) => c.x));
    minY = Math.min(minY, y - blockH, ...corners.map((c) => c.y));
    maxX = Math.max(maxX, x + TILE_W, ...corners.map((c) => c.x));
    maxY = Math.max(maxY, y + TILE_H * 2, ...corners.map((c) => c.y));
  }

  const pad = 56;
  return {
    minX: minX - pad,
    minY: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
    floorMinX,
    floorMaxX,
    floorMinY,
    floorMaxY,
  };
}
