// main.js - Sunset Quay: Neon Undertow bootstrap, game loop, screens, police bust flow and shot staging
import { buildCityBuildings, buildingAt, LANDMARKS, WORLD_W } from './cityMap.js';
import { initInput, keys, mouse } from './input.js';
import { createPlayer, updatePlayerOnFoot } from './player.js';
import { spawnParkedCars, updateCarDriving, nearestCar } from './vehicles.js';
import { spawnTraffic, updateTraffic } from './traffic.js';
import { spawnPedestrians, updatePedestrians } from './pedestrians.js';
import { createWantedSystem, spawnPolice, updatePolice } from './wanted.js';
import { createMissionState, updateMission, missionTarget, STORY_INTRO } from './missions.js';
import { createCombat, tryAttack, updateBullets } from './combat.js';
import { drawWorld, drawCar, drawPerson } from './renderWorld.js';
import { drawHUD, drawStartScreen, drawBustedScreen, drawWastedScreen } from './hud.js';
import { saveGame, loadGame } from './saveGame.js';
import { soundPickup, soundCash } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
initInput(canvas);
const params = new URLSearchParams(location.search);
const shotMode = params.get('shot');

const saved = loadGame();
const state = {
  screen: 'start', time: 0, cash: saved?.cash || 120, respect: saved?.respect || 0,
  buildings: buildCityBuildings(), landmarks: LANDMARKS,
  player: createPlayer(saved), driving: null,
  parked: spawnParkedCars(), traffic: spawnTraffic(), peds: spawnPedestrians(),
  wanted: createWantedSystem(), missions: createMissionState(), combat: createCombat(),
  police: [], message: STORY_INTRO, messageTimer: 8, bustProgress: 0,
};
if (saved?.missionIndex) state.missions.index = saved.missionIndex;
let enterCooldown = 0, saveMsgTimer = 0;

function playerPos() { return state.driving || state.player; }
function inputVec() { return { up: !!(keys.KeyW || keys.ArrowUp), down: !!(keys.KeyS || keys.ArrowDown), left: !!(keys.KeyA || keys.ArrowLeft), right: !!(keys.KeyD || keys.ArrowRight) }; }

function stageShot(mode) {
  state.screen = 'play';
  if (mode === 'start') { state.screen = 'start'; return; }
  if (mode === 'city') { const car = state.parked[1]; car.x = 660; car.y = 455; car.angle = 0; state.driving = car; state.player.x = car.x; state.player.y = car.y; state.message = 'Free roam in Sunset Quay - steal any car with E, follow the gold marker for missions.'; }
  if (mode === 'chase') { const car = state.parked[4]; car.x = 1460; car.y = 855; car.angle = 0; state.driving = car; state.player.x = car.x; state.player.y = car.y; state.wanted.reportCrime(85); state.police = spawnPolice(4, car); state.police.forEach((c, i) => { c.x = car.x - 180 - i * 90; c.y = car.y + (i % 2 ? 60 : -60); c.isPolice = true; }); state.message = 'WANTED! Outrun the Quay Patrol - break line of sight to cool down heat.'; }
  if (mode === 'mission') { state.player.x = 1560; state.player.y = 2720; state.missions.phase = 'pickup'; state.message = 'Mission: First Run - Pick up the package at Harbor Docks (gold marker).'; }
}

function doEnterExit() {
  if (enterCooldown > 0) return; enterCooldown = 0.35;
  if (state.driving) { state.player.x = state.driving.x + 36; state.player.y = state.driving.y; state.driving.parked = true; state.driving.speed = 0; state.driving = null; return; }
  const car = nearestCar([...state.parked, ...state.traffic], state.player.x, state.player.y, 75);
  if (car) { const wasParked = car.parked; state.driving = car; car.parked = false; car.driver = 'player'; if (wasParked) { state.wanted.reportCrime(18); flash('Car stolen! Heat rising - Quay Patrol may respond.'); } else flash(`Driving ${car.name}`); }
}
function flash(msg) { state.message = msg; state.messageTimer = 5; }

function step(dt) {
  state.time += dt; enterCooldown = Math.max(0, enterCooldown - dt);
  if (state.messageTimer > 0) state.messageTimer -= dt;
  const inp = inputVec(); const pos = playerPos();
  if (keys.KeyE) doEnterExit();
  if (keys.KeyM && saveMsgTimer <= 0) { saveGame({ cash: state.cash, respect: state.respect, missionIndex: state.missions.index, player: pos }); flash('Game saved to localStorage.'); saveMsgTimer = 2; }
  saveMsgTimer = Math.max(0, saveMsgTimer - dt);
  if (state.driving) { const before = { x: state.driving.x, y: state.driving.y }; updateCarDriving(state.driving, inp, dt); if (buildingAt(state.buildings, state.driving.x, state.driving.y, 16)) { state.driving.x = before.x; state.driving.y = before.y; state.driving.speed *= -0.3; state.driving.health -= 4; } state.player.x = state.driving.x; state.player.y = state.driving.y; state.player.angle = state.driving.angle;
    for (const p of state.peds) if (p.health > 0 && Math.abs(state.driving.speed) > 120 && Math.hypot(p.x - pos.x, p.y - pos.y) < 26) { p.health = 0; state.wanted.reportCrime(35); flash('Pedestrian hit! Wanted level rising!'); }
  } else updatePlayerOnFoot(state.player, inp, dt, state.buildings, buildingAt);
  // combat
  const aim = Math.atan2(mouse.y - 400, mouse.x - 640) + state.player.angle;
  if (keys.KeyF) { const r = tryAttack(state.combat, state.player, aim, state.wanted, false); if (r) for (const p of state.peds) if (Math.hypot(p.x - pos.x, p.y - pos.y) < 44) { p.health -= 40; state.wanted.reportCrime(15); flash('Melee hit!'); } }
  if (keys.Space || mouse.down) tryAttack(state.combat, state.player, state.player.angle, state.wanted, true);
  const hits = updateBullets(state.combat, dt, state.peds, [...state.parked, ...state.traffic]); if (hits.length) state.wanted.reportCrime(8);
  updateTraffic(state.traffic.filter(c => c !== state.driving), dt);
  const danger = state.wanted.stars > 0 || Math.abs(state.driving?.speed || 0) > 200 ? pos : null;
  updatePedestrians(state.peds, dt, danger);
  // wanted + police
  state.wanted.update(dt, false);
  const wantCount = state.wanted.stars >= 4 ? 5 : state.wanted.stars;
  if (state.wanted.stars > 0 && state.police.length < wantCount) state.police.push(...spawnPolice(wantCount - state.police.length, pos).map(c => ({ ...c, isPolice: true })));
  if (state.wanted.stars === 0) state.police = [];
  for (const c of state.police) c.isPolice = true;
  updatePolice(state.police, dt, pos);
  state.bustProgress = Math.max(0, ...state.police.map(c => c.bust || 0), 0);
  if (state.bustProgress > 2.2 && !state.driving) { state.screen = 'busted'; state.cash = Math.max(0, state.cash - 100); state.wanted.heat = 0; state.wanted.stars = 0; state.police = []; }
  if (state.driving && state.bustProgress > 3.5) { state.screen = 'busted'; state.cash = Math.max(0, state.cash - 150); state.wanted.heat = 0; state.wanted.stars = 0; state.police = []; state.driving = null; }
  if (state.player.health <= 0) state.screen = 'wasted';
  // missions
  const mm = updateMission(state.missions, pos, state, state.wanted); if (mm) { flash(mm); if (mm.includes('complete') || mm.includes('Complete')) soundCash(); else soundPickup(); }
}

function render() {
  ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, 1280, 800);
  if (state.screen === 'start') { drawStartScreen(ctx, !!saved); return; }
  const pos = playerPos(); const cam = { x: Math.max(0, Math.min(WORLD_W - 1280, pos.x - 640)), y: Math.max(0, Math.min(2920 - 800 + 180, pos.y - 400)) };
  const view = { ...state, missionTarget: missionTarget(state.missions), playerPos: pos, allCars: [...state.parked, ...state.traffic, ...state.police] };
  drawWorld(ctx, cam, view);
  for (const c of state.parked) if (c !== state.driving) drawCar(ctx, cam, c, false);
  for (const c of state.traffic) if (c !== state.driving) drawCar(ctx, cam, c, false);
  for (const c of state.police) drawCar(ctx, cam, c, false);
  for (const p of state.peds) if (p.health > 0) drawPerson(ctx, cam, p, false);
  for (const b of state.combat.bullets) { ctx.fillStyle = '#ffe66d'; ctx.fillRect(b.x - cam.x - 2, b.y - cam.y - 2, 5, 5); }
  if (state.driving) drawCar(ctx, cam, state.driving, true); else drawPerson(ctx, cam, state.player, true);
  const m = state.missions.current();
  drawHUD(ctx, { player: state.player, wanted: state.wanted, cash: state.cash, respect: state.respect, driving: state.driving, missionText: state.messageTimer > 0 ? state.message : (m ? `Mission: ${m.title} - ${m.brief}` : 'Free roam - story complete!'), subText: m ? `Giver: ${m.giver} - Reward $${m.reward} - M save, E car, F melee, Space shoot` : '', missionTarget: view.missionTarget, playerPos: pos, allCars: view.allCars });
  if (state.bustProgress > 0.3) { ctx.fillStyle = 'rgba(255,0,0,0.25)'; ctx.fillRect(440, 90, 400, 22); ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BUST METER - move away from police!', 640, 106); ctx.fillStyle = '#ff0'; ctx.fillRect(440, 90, 400 * Math.min(1, state.bustProgress / 3), 8); }
  if (state.screen === 'busted') drawBustedScreen(ctx, state.cash);
  if (state.screen === 'wasted') drawWastedScreen(ctx);
  if (state.screen === 'paused') { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, 1280, 800); ctx.fillStyle = '#fff'; ctx.font = 'bold 44px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PAUSED - P to resume', 640, 400); }
}

let last = performance.now();
function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (state.screen === 'play') step(dt);
  render(); requestAnimationFrame(loop);
}
addEventListener('keydown', e => {
  if (e.code === 'Enter' && state.screen === 'start') state.screen = 'play';
  if (e.code === 'KeyN' && state.screen === 'start') { state.cash = 120; state.missions.index = 0; state.screen = 'play'; }
  if (e.code === 'Enter' && (state.screen === 'busted' || state.screen === 'wasted')) { state.screen = 'play'; state.player.health = 100; state.player.x = 700; state.player.y = 1900; state.bustProgress = 0; }
  if (e.code === 'KeyP') state.screen = state.screen === 'paused' ? 'play' : (state.screen === 'play' ? 'paused' : state.screen);
});
if (shotMode) { stageShot(shotMode); render(); setTimeout(() => { render(); window.__shotReady = true; }, 350); }
else requestAnimationFrame(loop);
