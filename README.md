# FaceTime Wrapped

A Spotify-Wrapped-style year-in-review for your FaceTime calls. 11 animated slides that reveal your year of conversations — shareable, mobile-first, and built entirely in the browser.

---

## Slides

| # | Slide | What it shows |
|---|-------|---------------|
| 1 | **Intro** | FaceTime logo, tap to begin |
| 2 | **Total Calls** | Your yearly call count, animated count-up |
| 3 | **Total Time** | Hours spent on FaceTime |
| 4 | **Longest Call** | Your record call, timer counts up live |
| 5 | **Favourite Person** | Your #1 contact with total calls & hours |
| 6 | **Unique Contacts** | How many different people you called |
| 7 | **Top 3 Podium** | 🥇🥈🥉 your most-called contacts |
| 8 | **Places** | Every location you called from |
| 9 | **Longest Streak** | 🔥 most consecutive days calling someone |
| 10 | **Night Owl** | Calls made after midnight |
| 11 | **Share Card** | All stats in one card, ready to share |

---

## How to use

**Tap** anywhere to advance to the next slide.  
**Swipe left / right** on mobile to go forward or back.  
Hit **"Watch again"** on the final slide to replay from the start.  
Hit **"Share your Wrapped"** to share via the native share sheet (or copy to clipboard as a fallback).

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech

- **React 18** + **Vite** + **Tailwind CSS v4**
- No animation libraries — all transitions use CSS keyframes and a small `requestAnimationFrame` count-up hook
- Mobile-first, designed for an iPhone viewport (390 × 844)
