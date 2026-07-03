# Fortnite Portfolio

A Fortnite-themed 3D portfolio built with React Three Fiber. Fly the Battle Bus over the island, discover glowing landmarks, and explore portfolio sections.

## Features

- Cinematic intro flythrough with clouds and welcome overlay
- Free-drive Battle Bus controls (WASD / arrow keys + mobile joystick)
- Glowing POI landmarks for About, Projects, Skills, Experience, and Contact
- Section panels with placeholder content you can customize
- Minimap, bloom post-processing, and accessible fallback menu

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The first load may take a moment while ~60MB of 3D models download.

## Customize Content

Edit [`src/data/sections.ts`](src/data/sections.ts):

- `PORTFOLIO_NAME` — your name in the welcome text
- `sections` — POI positions, colors, and labels on the map
- `sectionContent` — text for each portfolio section

## Tune POI Positions

Landmark positions are placeholders. Fly the bus to good spots on the map and update the `position: [x, y, z]` values in `sections.ts`. The minimap shows bus and POI locations to help alignment.

## Models

Source models live in `3d models/` and are copied to `public/models/` for the app:

- `battle_bus.glb` (from `battle_bus_fortnite.glb`)
- `map.glb` (from `chapter2_season7_map.glb`)
- `laser_beam_v2.glb` (landmark POI beams)

For faster loads before deployment, compress with `@gltf-transform/cli`.

## Controls

| Input | Action |
|-------|--------|
| W / ↑ | Fly forward |
| S / ↓ | Fly backward |
| A / ← | Turn left |
| D / → | Turn right |
| E | Open nearby section |
| Esc | Close section panel |
| Drop In | Skip intro cinematic |

## Build

```bash
npm run build
npm run preview
```
