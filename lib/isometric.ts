export const TILE_W = 52;
export const TILE_H = 26;
export const BLOCK_H = 14;

export function gridToScreen(x: number, y: number, z = 0) {
  const sx = (x - y) * (TILE_W / 2);
  const sy = (x + y) * (TILE_H / 2) - z * BLOCK_H;
  return { x: sx, y: sy };
}

export function getViewBox(elements: { x: number; y: number; z?: number }[]) {
  if (elements.length === 0) {
    return { minX: -80, minY: -40, width: 320, height: 200 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    const { x, y } = gridToScreen(el.x, el.y, el.z ?? 0);
    const h = (Number(el.z) || 0) * BLOCK_H + TILE_H * 2;
    minX = Math.min(minX, x - TILE_W);
    minY = Math.min(minY, y - h);
    maxX = Math.max(maxX, x + TILE_W);
    maxY = Math.max(maxY, y + TILE_H * 2);
  }

  const pad = 40;
  return {
    minX: minX - pad,
    minY: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}
