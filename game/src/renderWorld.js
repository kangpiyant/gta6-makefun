// renderWorld.js - top-down rendering of Sunset Quay: water, roads, buildings, cars, people
export function drawWorld(ctx, cam, state) {
  const { buildings } = state;
  ctx.fillStyle = '#2d6a4f'; ctx.fillRect(0, 0, 1280, 800);
  const ox = -cam.x, oy = -cam.y;
  // water / beach at south
  ctx.fillStyle = '#118ab2'; ctx.fillRect(0, 2920 + oy, 1280, 400);
  ctx.fillStyle = '#ffd166'; ctx.fillRect(0, 2880 + oy, 1280, 45);
  // city ground
  ctx.fillStyle = '#3a4452'; ctx.fillRect(ox - 100, oy - 100, 3400, 3000);
  // roads
  ctx.fillStyle = '#22262e';
  for (let x = 0; x <= 3200; x += 400) ctx.fillRect(x + ox, oy, 110, 2920);
  for (let y = 0; y <= 2800; y += 400) ctx.fillRect(ox, y + oy, 3200, 110);
  ctx.strokeStyle = '#f4d35e'; ctx.setLineDash([18, 18]); ctx.lineWidth = 3;
  for (let x = 55; x <= 3200; x += 400) { ctx.beginPath(); ctx.moveTo(x + ox, oy); ctx.lineTo(x + ox, 2920 + oy); ctx.stroke(); }
  for (let y = 55; y <= 2800; y += 400) { ctx.beginPath(); ctx.moveTo(ox, y + oy); ctx.lineTo(3200 + ox, y + oy); ctx.stroke(); }
  ctx.setLineDash([]);
  // parks
  ctx.fillStyle = '#40916c'; ctx.fillRect(500 + ox, 500 + oy, 160, 160); ctx.fillRect(2100 + ox, 1700 + oy, 180, 180);
  // buildings
  for (const b of buildings) { if (b.x + b.w < cam.x - 50 || b.x > cam.x + 1330 || b.y + b.h < cam.y - 50 || b.y > cam.y + 850) continue;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(b.x + ox + 6, b.y + oy + 8, b.w, b.h);
    ctx.fillStyle = b.roof; ctx.fillRect(b.x + ox, b.y + oy, b.w, b.h);
    ctx.fillStyle = b.color; ctx.fillRect(b.x + ox + 6, b.y + oy + 6, b.w - 12, b.h - 12);
    ctx.fillStyle = '#ffe66d'; for (let wx = 14; wx < b.w - 14; wx += 22) for (let wy = 14; wy < b.h - 14; wy += 22) if ((wx * wy + b.id) % 3) ctx.fillRect(b.x + ox + wx, b.y + oy + wy, 8, 8);
  }
  // landmarks
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  for (const lm of state.landmarks) { ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(lm.x + ox, lm.y + oy, 12, 0, 7); ctx.fill(); ctx.fillStyle = '#111'; ctx.fillText('★', lm.x + ox, lm.y + oy + 5); ctx.fillStyle = '#fff'; ctx.fillText(lm.name, lm.x + ox, lm.y + oy - 20); }
  // mission marker
  if (state.missionTarget) { const t = state.missionTarget; ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(t.x + ox, t.y + oy, 26 + Math.sin(state.time * 5) * 5, 0, 7); ctx.fill(); ctx.fillStyle = '#111'; ctx.font = 'bold 20px sans-serif'; ctx.fillText('!', t.x + ox, t.y + oy + 7); }
}
export function drawCar(ctx, cam, car, isPlayerCar) {
  const x = car.x - cam.x, y = car.y - cam.y; if (x < -60 || x > 1340 || y < -60 || y > 860) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(car.angle);
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(-24, -12, 52, 28);
  ctx.fillStyle = car.color; ctx.fillRect(-26, -14, 52, 28);
  ctx.fillStyle = '#bfefff'; ctx.fillRect(2, -10, 14, 20); ctx.fillRect(-16, -10, 8, 20);
  ctx.fillStyle = '#111'; ctx.fillRect(-22, -17, 12, 5); ctx.fillRect(10, -17, 12, 5); ctx.fillRect(-22, 12, 12, 5); ctx.fillRect(10, 12, 12, 5);
  if (car.isPolice) { ctx.fillStyle = '#fff'; ctx.fillRect(-20, -14, 40, 28); ctx.fillStyle = '#2471a3'; ctx.fillRect(-6, -14, 12, 28); ctx.fillStyle = (Math.sin(car.siren) > 0 ? '#ff0000' : '#0066ff'); ctx.fillRect(-4, -4, 8, 8); }
  if (isPlayerCar) { ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(-8, -42); ctx.lineTo(8, -42); ctx.fill(); }
  ctx.restore();
}
export function drawPerson(ctx, cam, p, isPlayer) {
  const x = p.x - cam.x, y = p.y - cam.y; if (x < -30 || x > 1310 || y < -30 || y > 830) return;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 8, 10, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = isPlayer ? '#ff2e88' : (p.color || '#74b9ff'); ctx.fillRect(x - 7, y - 6, 14, 16);
  ctx.fillStyle = '#ffdbac'; ctx.beginPath(); ctx.arc(x, y - 12, 7, 0, 7); ctx.fill();
  if (isPlayer) { ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('MIRA ▼', x, y - 26); }
}
