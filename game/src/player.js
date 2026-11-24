// player.js - Mira Vale on foot: movement, entering cars, health
export function createPlayer(saved) {
  return { x: saved?.x || 300, y: saved?.y || 320, angle: 0, speed: 210, health: 100, radius: 14, name: 'Mira Vale' };
}
export function updatePlayerOnFoot(player, input, dt, buildings, buildingAtFn) {
  let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (dx || dy) { const len = Math.hypot(dx, dy); dx /= len; dy /= len; player.angle = Math.atan2(dy, dx);
    const nx = player.x + dx * player.speed * dt, ny = player.y + dy * player.speed * dt;
    if (!buildingAtFn(buildings, nx, player.y, 10)) player.x = nx;
    if (!buildingAtFn(buildings, player.x, ny, 10)) player.y = ny;
  }
  player.x = Math.max(15, Math.min(3185, player.x)); player.y = Math.max(15, Math.min(2900, player.y));
}
