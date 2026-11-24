// wanted.js - wanted stars, crime reporting, police pursuit AI
export function createWantedSystem() {
  return { stars: 0, heat: 0, decayTimer: 0,
    reportCrime(amount) { this.heat = Math.min(100, this.heat + amount); this.stars = Math.min(5, Math.floor(this.heat / 20)); },
    update(dt, hidden) { this.decayTimer += dt; if (this.decayTimer > (hidden ? 2 : 6)) { this.decayTimer = 0; this.heat = Math.max(0, this.heat - 4); this.stars = Math.min(5, Math.floor(this.heat / 20)); } }
  };
}
export function spawnPolice(count, around) {
  const cops = [];
  for (let i = 0; i < count; i++) {
    const a = (i / Math.max(1, count)) * Math.PI * 2;
    cops.push({ x: around.x + Math.cos(a) * 700, y: around.y + Math.sin(a) * 700, angle: a + Math.PI, speed: 0, maxSpeed: 390, color: '#dfe6e9', name: 'Quay Patrol', health: 100, siren: Math.random() * 6 });
  }
  return cops;
}
export function updatePolice(cops, dt, target) {
  for (const c of cops) {
    const want = Math.atan2(target.y - c.y, target.x - c.x);
    let diff = want - c.angle; while (diff > Math.PI) diff -= Math.PI * 2; while (diff < -Math.PI) diff += Math.PI * 2;
    c.angle += Math.max(-2.6 * dt, Math.min(2.6 * dt, diff));
    const dist = Math.hypot(target.x - c.x, target.y - c.y);
    const sp = dist > 60 ? c.maxSpeed : c.maxSpeed * 0.3;
    c.speed += (sp - c.speed) * Math.min(1, dt * 2);
    c.x += Math.cos(c.angle) * c.speed * dt; c.y += Math.sin(c.angle) * c.speed * dt;
    c.x = Math.max(15, Math.min(3185, c.x)); c.y = Math.max(15, Math.min(2900, c.y));
    c.siren += dt * 8;
    if (dist < 42) c.bust = (c.bust || 0) + dt; else c.bust = Math.max(0, (c.bust || 0) - dt);
  }
}
