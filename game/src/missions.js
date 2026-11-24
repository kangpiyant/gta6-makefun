// missions.js - story missions for Mira Vale in Sunset Quay
export const STORY_INTRO = 'Mira Vale returns to Sunset Quay to save her family dock from the Coral Syndicate.';
export const MISSIONS = [
  { title: 'First Run', giver: 'Uncle Bayu', brief: 'Pick up the package at Harbor Docks and bring it to Quay Garage.', pickup: { x: 1660, y: 2820 }, drop: { x: 1060, y: 660 }, reward: 250, wantedOnPickup: 1 },
  { title: 'Taxi Trouble', giver: 'Sari the Dispatcher', brief: 'Steal a Quay Taxi and reach Tide Mall before the timer ends.', needCarName: 'Quay Taxi', drop: { x: 660, y: 1820 }, reward: 400, timeLimit: 90 },
  { title: 'Casino Chip', giver: 'Uncle Bayu', brief: 'Grab the chip case at Pearl Casino, survive the heat, deliver to Mira Safehouse.', pickup: { x: 2260, y: 1020 }, drop: { x: 260, y: 260 }, reward: 700, wantedOnPickup: 3 },
  { title: 'Pier Finale', giver: 'Mira Vale', brief: 'Drive the package to Sunset Pier and end the Syndicate deal.', pickup: { x: 1060, y: 660 }, drop: { x: 2660, y: 2820 }, reward: 1200, wantedOnPickup: 2 },
];
export function createMissionState() {
  return { index: 0, phase: 'pickup', timer: 0, done: false, message: '',
    current() { return MISSIONS[this.index] || null; },
    startMessage() { const m = this.current(); return m ? `Mission: ${m.title} - ${m.brief}` : 'Free roam: all story missions complete!'; }
  };
}
export function updateMission(ms, player, state, wanted) {
  const m = ms.current(); if (!m || ms.done) return null;
  if (m.timeLimit && ms.phase === 'deliver') { ms.timer -= 1 / 60; if (ms.timer <= 0) { ms.phase = 'pickup'; return 'Mission failed - timer ran out. Try again.'; } }
  const target = (ms.phase === 'pickup' && m.pickup) ? m.pickup : m.drop;
  if (m.needCarName && ms.phase === 'pickup') {
    if (state.driving && state.driving.name === m.needCarName) { ms.phase = 'deliver'; ms.timer = m.timeLimit || 0; return `Got the ${m.needCarName}! Now reach ${'Tide Mall'}.`; }
    return null;
  }
  if (target && Math.hypot(player.x - target.x, player.y - target.y) < 80) {
    if (ms.phase === 'pickup') { ms.phase = 'deliver'; if (m.timeLimit) ms.timer = m.timeLimit; if (m.wantedOnPickup) wanted.reportCrime(m.wantedOnPickup * 20); return 'Package picked up! Deliver it to the gold marker.'; }
    state.cash += m.reward; state.respect += 10; ms.index++; ms.phase = 'pickup';
    if (ms.index >= MISSIONS.length) { ms.done = true; return `Story complete! Final reward $${m.reward}. Sunset Quay is free.`; }
    return `Mission complete! +$${m.reward}. Next: ${MISSIONS[ms.index].title}`;
  }
  return null;
}
export function missionTarget(ms) { const m = ms.current(); if (!m) return null; if (m.needCarName && ms.phase === 'pickup') return null; return (ms.phase === 'pickup' && m.pickup) ? m.pickup : m.drop; }
