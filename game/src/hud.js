// hud.js - HUD, wanted stars, cash, health bar and circular minimap
export function drawHUD(ctx, state) {
  const { player, wanted, cash, respect, missionText, driving } = state;
  ctx.fillStyle = 'rgba(5,8,18,0.72)'; ctx.fillRect(12, 12, 330, 92);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('SUNSET QUAY', 22, 38);
  ctx.font = '14px sans-serif'; ctx.fillStyle = '#ffd166'; ctx.fillText(`$${cash}   Respect ${respect}`, 22, 60);
  ctx.fillStyle = '#222'; ctx.fillRect(22, 68, 160, 12); ctx.fillStyle = player.health > 30 ? '#2ecc71' : '#e74c3c'; ctx.fillRect(22, 68, 160 * Math.max(0, player.health) / 100, 12);
  ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.fillText(driving ? `Driving: ${driving.name}` : 'On foot - WASD move, E enter car, F attack, Space shoot', 22, 96);
  // wanted stars top right beside minimap
  ctx.font = '30px sans-serif'; ctx.textAlign = 'right';
  for (let i = 0; i < 5; i++) { ctx.fillStyle = i < wanted.stars ? '#ffd700' : 'rgba(255,255,255,0.25)'; ctx.fillText('★', 1010 - i * 34, 44); }
  if (wanted.stars > 0) { ctx.fillStyle = '#ff6b6b'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('WANTED - escape or avoid police!', 1010, 68); }
  // mission banner bottom
  if (missionText) { ctx.fillStyle = 'rgba(5,8,18,0.78)'; ctx.fillRect(240, 716, 800, 56); ctx.fillStyle = '#ffd166'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(missionText.slice(0, 95), 640, 740); ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.fillText(state.subText || '', 640, 760); }
  drawMinimap(ctx, state);
}
export function drawMinimap(ctx, state) {
  const cx = 1160, cy = 110, r = 92;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  ctx.fillStyle = '#243447'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  const scale = (r * 2) / 1400; const px = state.playerPos.x, py = state.playerPos.y;
  ctx.fillStyle = '#11161d'; for (let x = 0; x <= 3200; x += 400) ctx.fillRect(cx + (x - px) * scale - 2, cy - r, 14 * scale + 3, r * 2); for (let y = 0; y <= 3200; y += 400) ctx.fillRect(cx - r, cy + (y - py) * scale - 2, r * 2, 14 * scale + 3);
  ctx.fillStyle = '#118ab2'; ctx.fillRect(cx - r, cy + (2920 - py) * scale, r * 2, r);
  for (const c of state.allCars) { ctx.fillStyle = c.isPolice ? (Math.sin(c.siren || 0) > 0 ? 'red' : 'blue') : '#f1c40f'; ctx.fillRect(cx + (c.x - px) * scale - 2, cy + (c.y - py) * scale - 2, 4, 4); }
  if (state.missionTarget) { ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(cx + (state.missionTarget.x - px) * scale, cy + (state.missionTarget.y - py) * scale, 6, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#ff2e88'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('MINIMAP', cx, cy + r + 16);
}
export function drawStartScreen(ctx, hasSave) {
  const g = ctx.createLinearGradient(0, 0, 0, 800); g.addColorStop(0, '#ff7b54'); g.addColorStop(0.55, '#5b2a86'); g.addColorStop(1, '#0b1020'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 800);
  ctx.fillStyle = '#ffd166'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 173) % 1280, 480 + (i * 37) % 120, 46, 90);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = 'bold 64px sans-serif'; ctx.fillText('SUNSET QUAY', 640, 250);
  ctx.fillStyle = '#ffd166'; ctx.font = 'bold 36px sans-serif'; ctx.fillText('NEON UNDERTOW', 640, 300);
  ctx.fillStyle = '#fff'; ctx.font = '18px sans-serif'; ctx.fillText('An original open-world crime story. Mira Vale vs the Coral Syndicate.', 640, 350);
  ctx.fillText('Explore on foot and by car - steal cars, run missions, outrun the Quay Patrol.', 640, 380);
  ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#2ecc71'; ctx.fillText(hasSave ? 'Press ENTER to continue - N for new game' : 'Press ENTER to start', 640, 450);
  ctx.fillStyle = '#ddd'; ctx.font = '15px sans-serif'; ctx.fillText('WASD/Arrows move & drive - E enter/exit car - F melee - Space shoot - M save - P pause', 640, 700);
}
export function drawBustedScreen(ctx, cash) { ctx.fillStyle = 'rgba(120,0,0,0.82)'; ctx.fillRect(0, 0, 1280, 800); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 64px sans-serif'; ctx.fillText('BUSTED', 640, 360); ctx.font = '20px sans-serif'; ctx.fillText(`Quay Patrol caught Mira. Fine paid, cash left $${cash}. Press ENTER to respawn.`, 640, 420); }
export function drawWastedScreen(ctx) { ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, 1280, 800); ctx.fillStyle = '#e74c3c'; ctx.textAlign = 'center'; ctx.font = 'bold 64px sans-serif'; ctx.fillText('WASTED', 640, 360); ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif'; ctx.fillText('Mira wakes at Sunset Clinic. Press ENTER to continue.', 640, 420); }
