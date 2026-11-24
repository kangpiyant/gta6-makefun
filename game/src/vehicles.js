// vehicles.js - stealable cars, driving physics, parked spawns
export const CAR_TYPES = [
  { name: 'Kuda Compact', color: '#e74c3c', speed: 340, accel: 260 },
  { name: 'Pelican Sedan', color: '#3498db', speed: 380, accel: 300 },
  { name: 'Quay Taxi', color: '#f1c40f', speed: 360, accel: 280 },
  { name: 'Cargo Van', color: '#ecf0f1', speed: 300, accel: 220 },
  { name: 'Viper Coupe', color: '#9b59b6', speed: 460, accel: 380 },
  { name: 'Harbor Pickup', color: '#2ecc71', speed: 330, accel: 250 },
];
let carId = 0;
export function spawnParkedCars() {
  const cars = []; let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < 42; i++) {
    const horiz = rnd() > 0.5;
    const gx = Math.floor(rnd() * 8) * 400, gy = Math.floor(rnd() * 8) * 400;
    const x = horiz ? gx + 60 + rnd() * 2600 % 300 : gx + 20 + rnd() * 60;
    const y = horiz ? gy + 20 + rnd() * 60 : gy + 60 + rnd() * 260;
    const t = CAR_TYPES[Math.floor(rnd() * CAR_TYPES.length)];
    cars.push({ id: carId++, x: Math.min(x, 3100), y: Math.min(y, 2850), angle: horiz ? 0 : Math.PI / 2, vx: 0, vy: 0, speed: 0, type: t, color: t.color, name: t.name, driver: null, parked: true, health: 100 });
  }
  return cars;
}
export function updateCarDriving(car, input, dt) {
  const fwd = (input.up ? 1 : 0) - (input.down ? 1 : 0);
  car.speed += fwd * car.type.accel * dt;
  car.speed *= Math.pow(0.35, dt);
  if (car.speed > car.type.speed) car.speed = car.type.speed;
  if (car.speed < -car.type.speed * 0.45) car.speed = -car.type.speed * 0.45;
  const steer = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (Math.abs(car.speed) > 5) car.angle += steer * 2.4 * dt * Math.sign(car.speed);
  car.x += Math.cos(car.angle) * car.speed * dt;
  car.y += Math.sin(car.angle) * car.speed * dt;
  car.x = Math.max(20, Math.min(3180, car.x)); car.y = Math.max(20, Math.min(2900, car.y));
}
export function nearestCar(cars, x, y, maxDist = 70) {
  let best = null, bd = maxDist;
  for (const c of cars) { const d = Math.hypot(c.x - x, c.y - y); if (d < bd) { bd = d; best = c; } }
  return best;
}
