# FaceTime Wrapped

FaceTime Wrapped is a concept app inspired by Spotify Wrapped — but instead of music stats, it replays your year of FaceTime calls as a series of beautiful, animated slides.

The idea is that at the end of the year, iPhone users get a personalised story showing who they called most, how long they talked, their most epic call, the places they called from, and their longest streak with someone. Stats that people actually care about — the kind you want to screenshot and share.

Each slide is designed to feel like a moment. Big numbers count up in front of you, names slam onto the screen, flames flicker on your streak. Then at the end, everything is pulled into a single shareable card — your FaceTime year at a glance.

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
