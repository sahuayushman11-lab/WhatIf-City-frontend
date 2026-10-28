# WhatIf-City-frontend

> **WhatIf City — Interactive Urban Scenario Simulation Platform (Frontend Web Client)**

Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Leaflet GIS**.

## 🚀 Features

- **Landing Page:** Interactive hero with live slider teaser, 4-step workflow, and curated scenario showcase.
- **Scenario Library:** Searchable catalog with category filtering and custom scenario template creation.
- **Simulation Lab:**
  - Configurable signal parameters (arrival rate, cycle length, effective green, clearance, pedestrian walk phase).
  - Defensive timing validation preventing infeasible signal splits.
  - Animated SVG **Schematic Intersection Visualizer** with dynamic traffic lights, queued cars, and pedestrian walk phase.
  - **OpenStreetMap GIS Mapping** with Leaflet and offline fallback.
  - Dynamic Recharts queue progression line graphs and Level of Service (LOS A–F) badges.
- **Multi-Scenario Comparison:**
  - Side-by-side comparison of **Baseline**, **Plan A**, and **Plan B**.
  - Delta indicators and safe percentage calculations (zero-denominator protection).
  - Configurable multi-objective weighting (*Balanced*, *Minimize Delay*, *Minimize Queue*, *Prioritize Pedestrians*).
  - Explicit policy trade-off matrix.
  - One-click CSV export and print-ready PDF styling.
- **Saved Projects:** Turnkey local persistence with cloud sync capability.
- **Dark/Light Mode:** Seamless theme switching with persistent state.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run Vitest test suite
npm test

# Build production bundle
npm run build
```
