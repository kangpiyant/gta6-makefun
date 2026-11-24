// input.js - keyboard and mouse state for Sunset Quay
export const keys = {};
export const mouse = { x: 0, y: 0, down: false };
export function initInput(canvas) {
  addEventListener('keydown', e => { keys[e.code] = true; if (['ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault(); });
  addEventListener('keyup', e => { keys[e.code] = false; });
  canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * (canvas.width / r.width); mouse.y = (e.clientY - r.top) * (canvas.height / r.height); });
  canvas.addEventListener('mousedown', () => { mouse.down = true; });
  addEventListener('mouseup', () => { mouse.down = false; });
}
export function pressed(code) { return !!keys[code]; }
