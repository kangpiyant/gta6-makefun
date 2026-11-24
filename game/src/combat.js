// combat.js - basic melee and shooting, bullets, health
export function createCombat() { return { cooldown: 0, bullets: [] }; }
export function tryAttack(combat, player, aimAngle, wanted, isShot) {
  if (combat.cooldown > 0) return null;
  combat.cooldown = isShot ? 0.22 : 0.4;
  if (isShot) { combat.bullets.push({ x: player.x, y: player.y, vx: Math.cos(aimAngle) * 700, vy: Math.sin(aimAngle) * 700, life: 0.7 }); wanted.reportCrime(12); return 'shot'; }
  return 'melee';
}
export function updateBullets(combat, dt, peds, cars) {
  const hits = [];
  for (const b of combat.bullets) { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    for (const p of peds) if (p.health > 0 && Math.hypot(p.x - b.x, p.y - b.y) < 16) { p.health -= 50; b.life = 0; hits.push('ped'); }
    for (const c of cars) if (Math.hypot(c.x - b.x, c.y - b.y) < 30) { c.health -= 20; b.life = 0; hits.push('car'); }
  }
  combat.bullets = combat.bullets.filter(b => b.life > 0);
  combat.cooldown = Math.max(0, combat.cooldown - dt);
  return hits;
}
