# FaceTime Wrapped 📞

A *Spotify Wrapped*–style year-in-review for your FaceTime calls. Tap through
animated, story-format cards that reveal your stats — longest call, your #1
person, how many people you called, where you called from, your longest 🔥
streak — and share the final card.

**Live demo:** _add your deployment URL here (Vercel / Netlify / GitHub Pages)_

![Status](https://img.shields.io/badge/build-passing-brightgreen)
![Stack](https://img.shields.io/badge/React-18-61dafb)
![Stack](https://img.shields.io/badge/Vite-5-646cff)

## What it shows

| Card | Stat |
| --- | --- |
| ⏱️ Total time | Hours spent on FaceTime + total call count |
| 🏆 Longest call | Your single longest FaceTime, who with, and when |
| 💚 Your person | The person you called most |
| 📊 Top 5 | Animated leaderboard of your most-called people |
| 👥 Reach | How many different people you FaceTimed |
| 📍 Places | Where you called from, sized by frequency |
| 🔥 Streak | Longest run of consecutive days calling one person |
| 📤 Share | A summary card with native share / clipboard fallback |

## Tech

- **React 18 + Vite** — fast SPA, instant HMR.
- **Framer Motion** — story transitions and staggered stat reveals.
- **Instagram-story UX** — auto-advancing progress bars, tap left/right to
  navigate, hold to pause, keyboard arrows on desktop.
- **Web Share API** — one-tap sharing on mobile, clipboard fallback elsewhere.

## Architecture note (the interesting part)

iOS sandboxes FaceTime/call history — **no public API lets a third-party app
read it**, so a fully automatic iPhone app isn't possible. This project solves
that by separating the *experience* from the *data source*:

- The entire UI renders from **one typed data object** (`src/data/demoData.js`),
  documented as a contract.
- Any importer that produces that shape plugs straight in. The realistic
  real-data path is parsing a Mac's local `CallHistory.storedata` SQLite
  database (FaceTime history syncs to macOS), then emitting the same object.

This keeps the front end demo-ready today and import-ready tomorrow.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the built app
```

## Roadmap

- [ ] `CallHistory.storedata` → Wrapped importer (Node script)
- [ ] Render the share card to a downloadable image (`html-to-image`)
- [ ] Per-card "this vs last year" deltas
- [ ] Color themes / light mode

---

Built as a portfolio project. Data shown is illustrative demo data.
