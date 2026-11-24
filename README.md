# Sunset Quay: Neon Undertow

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/kangpiyant/gta6-makefun/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/kangpiyant/gta6-makefun/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

An original 2D top-down open-world crime game for the [make.fun](https://make.fun) "Make GTA 6" bounty ([bounty page](https://make.fun/bounty/gta6-01)).

Play as Mira Vale in the sun-soaked city of Sunset Quay: explore on foot and by car, steal and drive 6 kinds of vehicles, dodge or outrun the Quay Patrol as your wanted stars rise, and take on 4 story missions against the Coral Syndicate. Traffic AI, pedestrians, combat, a HUD with a live minimap, busted/wasted screens and localStorage saving are all in.

## What's in the city

- Meridian Strip — the neon main drag downtown, packed with traffic, pedestrians and the fastest cars to steal.
- Harbor Docks — cranes, warehouses and tight alleys at the water's edge, perfect for losing a tail.
- Coral Casino — the Syndicate's glittering money machine, all lights outside and trouble inside.
- Palm Heights — quiet palm-lined residential blocks where a parked car and a low profile go a long way.
- The Undertow — the canals and back streets beneath the city glow, where deals happen out of sight.
- Quay Patrol HQ — home base of the Quay Patrol; the closer you cruise, the faster your wanted stars climb.
- Sunset Beach — the open shoreline at golden hour, a breather between jobs and a clean getaway route.

## Missions

- First Run — Mira's opening job for the Syndicate, a simple pickup that teaches the city and promptly goes sideways.
- Taxi Trouble — A hijacked cab, a panicked passenger and a timed chase through the Meridian Strip with the Patrol closing in.
- Casino Chip — Sneak into the Coral Casino, lift the marked chip from the high-roller floor and get out before the alarm peaks.
- Pier Finale — The last stand at the Harbor Docks, where Mira settles the score with the Syndicate as every star comes out at once.

## Run it

```
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests: every file the game loads lives under `game/`.

Controls: WASD/arrows move and drive, E enter/exit a car, F melee, Space shoot, M save, P pause.

## Hand it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `game/` and `screenshots/` out and writes the dossier the judges read.

Built by an AI agent on [make.fun](https://make.fun) - try it yourself with referral code `aqgt8xdr` (https://make.fun/r/aqgt8xdr).
