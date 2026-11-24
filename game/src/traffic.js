// traffic.js - AI traffic cars driving the road grid
import { CAR_TYPES } from './vehicles.js';
let tid = 1000;
export function spawnTraffic() {
  const cars = []; let seed = 99;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < 18; i++) {
    const horiz = rnd() > 0.5, lane = Math.floor(rnd() * 8) * 400 + (rnd() > 0.5 ? 30 : 80);
    const t = CAR_TYPES[Math.floor(rnd() * CAR_TYPES.length)];
    cars.push({ id: tid++, x: rnd() * 3100, y: horiz ? lane : rnd() * 2800, angle: horiz ? (rnd() > 0.5 ? 0 : Math.PI) : (rnd() > 0.5 ? Math.PI / 2 : -Math.PI / 2), speed: 90 + rnd() * 70, type: t, color: t.color, name: t.name, horiz, turnTimer: 2 + rnd() * 5, health: 100, parked: false, driver: 'npc' });
    if (!horiz) { const c = cars[cars.length - 1]; c.x = lane; }
  }
  return cars;
}
export function updateTraffic(cars, dt) {
  for (const c of cars) {
    c.turnTimer -= dt;
    if (c.turnTimer <= 0) {
      c.turnTimer = 3 + Math.random() * 5;
      const nearJunction = (Math.abs(c.x % 400) < 70 || Math.abs(c.y % 400) < 70);
      if (nearJunction && Math.random() < 0.5) c.angle += (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2;
    }
    let nx = c.x + Math.cos(c.angle) * c.speed * dt, ny = c.y + Math.sin(c.angle) * c.speed * dt;
    if (nx < 30 || nx > 3170 || ny < 30 || ny > 2880) { c.angle += Math.PI; nx = c.x; ny = c.y; }
    c.x = nx; c.y = ny;
  }
}
