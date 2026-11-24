// saveGame.js - localStorage save / load
const KEY = 'sunset-quay-save-v1';
export function saveGame(state) {
  try { localStorage.setItem(KEY, JSON.stringify({ cash: state.cash, respect: state.respect, missionIndex: state.missionIndex, x: state.player.x, y: state.player.y, savedAt: Date.now() })); } catch {}
}
export function loadGame() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(KEY); } catch {} }
