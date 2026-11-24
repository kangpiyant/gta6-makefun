// cityMap.js - Sunset Quay city layout: road grid, blocks, buildings, landmarks
export const WORLD_W = 3200;
export const WORLD_H = 3200;
export const ROAD_SPACING = 400;
export const ROAD_W = 110;
export function isRoad(x, y) {
  const mx = ((x % ROAD_SPACING) + ROAD_SPACING) % ROAD_SPACING;
  const my = ((y % ROAD_SPACING) + ROAD_SPACING) % ROAD_SPACING;
  return mx < ROAD_W || my < ROAD_W;
}
export function isWater(x, y) { return y > 2920; }
export function buildCityBuildings() {
  const buildings = [];
  const names = ['Quay Tower','Coral Hotel','Neon Arcade','Harbor Bank','Palm Court','Tide Mall','Marina Lofts','Sunset Clinic','Cargo Depot','Pearl Casino','Fish Market','Radio Quay'];
  let seed = 42;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let id = 0;
  for (let bx = 0; bx < 8; bx++) for (let by = 0; by < 7; by++) {
    const ox = bx * ROAD_SPACING + ROAD_W + 18, oy = by * ROAD_SPACING + ROAD_W + 18;
    const bw = ROAD_SPACING - ROAD_W - 36;
    for (let k = 0; k < 2; k++) {
      const w = 90 + rnd() * 70, h = 80 + rnd() * 70;
      const x = ox + rnd() * (bw - w), y = oy + rnd() * (bw - h);
      const hues = [18, 190, 280, 45, 330, 150];
      buildings.push({ id: id++, x, y, w, h, color: `hsl(${hues[id % hues.length]},45%,${28 + rnd() * 22}%)`, roof: `hsl(${hues[id % hues.length]},55%,${38 + rnd() * 20}%)`, name: names[id % names.length], floors: 3 + Math.floor(rnd() * 9) });
    }
  }
  return buildings;
}
export const LANDMARKS = [
  { name: 'Mira Safehouse', x: 260, y: 260, kind: 'safehouse' },
  { name: 'Quay Garage', x: 1060, y: 660, kind: 'garage' },
  { name: 'Harbor Docks', x: 1660, y: 2860, kind: 'docks' },
  { name: 'Pearl Casino', x: 2260, y: 1060, kind: 'casino' },
  { name: 'Tide Mall', x: 660, y: 1860, kind: 'mall' },
  { name: 'Sunset Pier', x: 2660, y: 2860, kind: 'pier' },
];
export function buildingAt(buildings, x, y, pad = 0) {
  return buildings.find(b => x > b.x - pad && x < b.x + b.w + pad && y > b.y - pad && y < b.y + b.h + pad) || null;
}
