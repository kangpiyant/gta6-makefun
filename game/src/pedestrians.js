// pedestrians.js - walking citizens who flee from danger
const SHIRTS = ['#ff7675','#74b9ff','#ffeaa7','#55efc4','#fd79a8','#a29bfe','#fab1a0'];
export function spawnPedestrians() {
  const peds = []; let seed = 31;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < 36; i++) peds.push({ x: 100 + rnd() * 3000, y: 100 + rnd() * 2700, angle: rnd() * Math.PI * 2, speed: 28 + rnd() * 30, color: SHIRTS[i % SHIRTS.length], state: 'walk', timer: rnd() * 4, health: 100 });
  return peds;
}
export function updatePedestrians(peds, dt, danger) {
  for (const p of peds) {
    if (p.health <= 0) continue;
    p.timer -= dt;
    if (danger && Math.hypot(p.x - danger.x, p.y - danger.y) < 180) { p.state = 'flee'; p.angle = Math.atan2(p.y - danger.y, p.x - danger.x); }
    else if (p.timer <= 0) { p.timer = 2 + Math.random() * 3; p.angle = Math.random() * Math.PI * 2; p.state = 'walk'; }
    const sp = p.state === 'flee' ? 130 : p.speed;
    p.x += Math.cos(p.angle) * sp * dt; p.y += Math.sin(p.angle) * sp * dt;
    p.x = Math.max(15, Math.min(3185, p.x)); p.y = Math.max(15, Math.min(2900, p.y));
  }
}
